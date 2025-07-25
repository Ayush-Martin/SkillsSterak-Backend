import mongoose, { Model } from "mongoose";
import { ITransactionRepository } from "../interfaces/repositories/ITransaction.repository";
import { ITransaction, ITransactionStatus } from "../models/Transaction.model";
import BaseRepository from "./Base.repository";
import envConfig from "../config/env";

class TransactionRepository
  extends BaseRepository<ITransaction>
  implements ITransactionRepository
{
  constructor(private Transaction: Model<ITransaction>) {
    super(Transaction);
  }

  public async getUserTransactions(
    userId: string,
    skip: number,
    limit: number
  ): Promise<Array<ITransaction>> {
    // return await this.Transaction.find({
    //   $or: [{ payerId: userId }, { receiverId: userId }],
    // })
    //   .sort({ createdAt: -1 })
    //   .skip(skip)
    //   .limit(limit)
    //   .populate("payerId", "email _id role")
    //   .populate("receiverId", "email _id role")
    //   .populate("courseId", "title _id");

    return await this.Transaction.aggregate([
      {
        $match: {
          $or: [
            { payerId: new mongoose.Types.ObjectId(userId) },
            { receiverId: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "payerId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                email: 1,
                role: 1,
              },
            },
          ],
          as: "payer",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "receiverId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                email: 1,
                role: 1,
              },
            },
          ],
          as: "receiver",
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                title: 1,
                thumbnail: 1,
              },
            },
          ],
          as: "course",
        },
      },
      {
        $unwind: {
          path: "$payer",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$receiver",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$course",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          _id: 1,
          payer: 1,
          receiver: 1,
          amount: 1,
          type: 1,
          method: 1,
          status: 1,
          course: 1,
          adminCommission: 1,
        },
      },

      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
  }

  public async getUserTransactionCount(userId: string): Promise<number> {
    return await this.Transaction.countDocuments({
      $or: [{ payerId: userId }, { receiverId: userId }],
    });
  }

  public async getTransactions(
    skip: number,
    limit: number
  ): Promise<Array<ITransaction>> {
    return await this.Transaction.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("payerId", "email _id role")
      .populate("receiverId", "email _id role")
      .populate("courseId", "title _id");
  }

  public async getTransactionCount(): Promise<number> {
    return await this.Transaction.countDocuments();
  }

  public async getAdminRevenueCount(
    filter: Record<string, any>
  ): Promise<number> {
    return await this.Transaction.countDocuments({
      receiverId: null,
      ...filter,
    });
  }

  public async getTrainerRevenueCount(
    trainerId: string,
    filter: Record<string, any>
  ): Promise<number> {
    return await this.Transaction.countDocuments({
      receiverId: trainerId,
      status: "completed",
      type: "course_purchase",
      ...filter,
    });
  }

  public async getTrainerRevenue(
    trainerId: string,
    filter: Record<string, any>,
    skip?: number,
    limit?: number
  ): Promise<ITransaction> {
    const pagination =
      skip && limit ? [{ $skip: skip }, { $limit: limit }] : [];

    const data = await this.Transaction.aggregate([
      {
        $match: {
          type: "course_purchase",
          $or: [{ status: "completed" }, { status: "on_process" }],
          receiverId: trainerId,
          ...filter,
        },
      },
      {
        $facet: {
          totalRevenue: [
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" },
              },
            },
            {
              $project: {
                _id: 0,
                totalRevenue: {
                  $subtract: ["$total", { $multiply: ["$total", 0.1] }],
                },
              },
            },
          ],
          totalCommission: [
            {
              $group: {
                _id: null,
                totalCommission: { $sum: "$adminCommission" },
              },
            },
          ],
          onProcessAmount: [
            {
              $match: {
                status: "on_process",
              },
            },
            {
              $group: {
                _id: null,
                onProcessAmount: { $sum: "$amount" },
              },
            },
          ],
          transactions: [
            {
              $lookup: {
                from: "users",
                localField: "payerId",
                foreignField: "_id",
                pipeline: [
                  {
                    $project: {
                      payer: "$username",
                    },
                  },
                ],
                as: "payer",
              },
            },

            { $unwind: "$payer" },
            {
              $lookup: {
                from: "courses",
                localField: "courseId",
                foreignField: "_id",
                pipeline: [
                  {
                    $project: {
                      title: 1,
                    },
                  },
                ],
                as: "course",
              },
            },
            { $unwind: "$course" },
            {
              $project: {
                _id: 1,
                payer: "$payer.payer",
                course: "$course.title",
                amount: 1,
                status: 1,
                adminCommission: 1,
              },
            },
            {
              $sort: {
                createdAt: -1,
              },
            },
            ...pagination,
          ],
        },
      },
      {
        $unwind: {
          path: "$totalRevenue",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$totalCommission",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$onProcessAmount",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          totalRevenue: {
            $ifNull: ["$totalRevenue.totalRevenue", 0],
          },
          totalCommission: {
            $ifNull: ["$totalCommission.totalCommission", 0],
          },
          onProcessAmount: {
            $ifNull: ["$onProcessAmount.onProcessAmount", 0],
          },
          transactions: 1,
        },
      },
    ]);

    return data[0];
  }

  public async getAdminRevenue(
    filter: Record<string, any>,
    skip?: number,
    limit?: number
  ): Promise<ITransaction> {
    const pagination =
      skip && limit ? [{ $skip: skip }, { $limit: limit }] : [];
    const data = await this.Transaction.aggregate([
      {
        $match: {
          receiverId: null,
          ...filter,
        },
      },

      {
        $facet: {
          totalRevenue: [
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$amount" },
              },
            },
          ],
          subscriptionRevenue: [
            { $match: { type: "subscription" } },
            {
              $group: {
                _id: null,
                subscriptionRevenue: {
                  $sum: "$amount",
                },
              },
            },
          ],
          commissionRevenue: [
            { $match: { type: "commission" } },
            {
              $group: {
                _id: null,
                commissionRevenue: { $sum: "$amount" },
              },
            },
          ],
          transactions: [
            {
              $lookup: {
                from: "users",
                localField: "payerId",
                foreignField: "_id",
                pipeline: [{ $project: { email: 1 } }],
                as: "user",
              },
            },
            {
              $unwind: "$user",
            },
            {
              $sort: {
                createdAt: -1,
              },
            },
            ...pagination,
            {
              $project: {
                _id: 1,
                type: 1,
                amount: 1,
                payer: "$user.email",
              },
            },
          ],
        },
      },
      { $unwind: { path: "$totalRevenue", preserveNullAndEmptyArrays: true } },
      {
        $unwind: {
          path: "$subscriptionRevenue",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$commissionRevenue",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          totalRevenue: { $ifNull: ["$totalRevenue.totalRevenue", 0] },
          commissionRevenue: {
            $ifNull: ["$commissionRevenue.commissionRevenue", 0],
          },
          subscriptionRevenue: {
            $ifNull: ["$subscriptionRevenue.subscriptionRevenue", 0],
          },
          transactions: 1,
        },
      },
    ]);

    return data[0];
  }

  public async getAdminRevenueGraphData(): Promise<ITransaction> {
    const data = await this.Transaction.aggregate([
      {
        $match: {
          receiverId: null,
        },
      },
      {
        $facet: {
          daily: [
            {
              $group: {
                _id: {
                  $dateToString: { format: "%d", date: "$createdAt" },
                },
                value: { $sum: "$amount" },
              },
            },
            { $sort: { _id: 1 } },
            {
              $project: {
                label: "$_id",
                value: 1,
                _id: 0,
              },
            },
          ],
          monthly: [
            {
              $group: {
                _id: {
                  $dateToString: { format: "%m", date: "$createdAt" },
                },
                value: { $sum: "$amount" },
              },
            },
            { $sort: { _id: 1 } },
            {
              $project: {
                label: "$_id",
                value: 1,
                _id: 0,
              },
            },
          ],
          yearly: [
            {
              $group: {
                _id: { $year: "$createdAt" },
                value: { $sum: "$amount" },
              },
            },
            { $sort: { _id: 1 } },
            {
              $project: {
                label: { $toString: "$_id" },
                value: 1,
                _id: 0,
              },
            },
          ],
        },
      },
    ]);

    return data[0];
  }

  public async getTrainerRevenueGraphData(
    trainerId: string
  ): Promise<ITransaction> {
    console.log("dfdfdf");
    const data = await this.Transaction.aggregate([
      {
        $match: {
          receiverId: new mongoose.Types.ObjectId(trainerId),
        },
      },
      {
        $facet: {
          daily: [
            {
              $group: {
                _id: {
                  $dateToString: { format: "%d", date: "$createdAt" },
                },
                value: { $sum: "$amount" },
              },
            },
            { $sort: { _id: 1 } },
            {
              $project: {
                label: "$_id",
                value: 1,
                _id: 0,
              },
            },
          ],
          monthly: [
            {
              $group: {
                _id: {
                  $dateToString: { format: "%m", date: "$createdAt" },
                },
                value: { $sum: "$amount" },
              },
            },
            { $sort: { _id: 1 } },
            {
              $project: {
                label: "$_id",
                value: 1,
                _id: 0,
              },
            },
          ],
          yearly: [
            {
              $group: {
                _id: { $year: "$createdAt" },
                value: { $sum: "$amount" },
              },
            },
            { $sort: { _id: 1 } },
            {
              $project: {
                label: { $toString: "$_id" },
                value: 1,
                _id: 0,
              },
            },
          ],
        },
      },
    ]);

    return data[0];
  }

  public async changePaymentStatus(
    transactionId: string,
    status: ITransactionStatus
  ): Promise<ITransaction | null> {
    return await this.Transaction.findByIdAndUpdate(transactionId, {
      $set: { status },
    });
  }

  public async updateOnProcessPurchaseTransactions(): Promise<ITransaction[]> {
    const now = new Date();

    const transactions = await this.Transaction.find({
      status: "on_process",
      type: "course_purchase",
      cancelTime: { $lt: now }, // expired
    });

    console.log(transactions);

    await this.Transaction.updateMany(
      {
        status: "on_process",
        type: "course_purchase",
        cancelTime: { $lt: now },
      },
      {
        $set: { status: "completed" },
      }
    );

    return transactions;
  }
}

export default TransactionRepository;
