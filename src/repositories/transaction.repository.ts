import mongoose, { Model } from "mongoose";
import { ITransactionRepository } from "../interfaces/repositories/ITransaction.repository";
import { ITransaction } from "../models/Transaction.model";
import BaseRepository from "./Base.repository";

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
    return await this.Transaction.find({
      $or: [{ payerId: userId }, { receiverId: userId }],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("payerId", "email _id role")
      .populate("receiverId", "email _id role")
      .populate("courseId", "title _id");
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
      type: "payment",
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
          type: "payment",
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
        $project: {
          totalRevenue: {
            $ifNull: ["$totalRevenue.totalRevenue", 0],
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
}

export default TransactionRepository;
