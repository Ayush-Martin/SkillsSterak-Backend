import mongoose, { Model } from "mongoose";
import { ISubscription } from "../models/Subscription.model";
import BaseRepository from "./Base.repository";
import { ISubscriptionRepository } from "../interfaces/repositories/ISubscription.repository";

class SubscriptionRepository
  extends BaseRepository<ISubscription>
  implements ISubscriptionRepository
{
  constructor(private _Subscription: Model<ISubscription>) {
    super(_Subscription);
  }

  public async getSubscriptionDetailByUserID(
    userId: string
  ): Promise<ISubscription | null> {
    return await this._Subscription.findOne({ userId });
  }

  public async getSubscribedUsersCount(
    search: RegExp,
    subscriptionPlanId: string | undefined
  ): Promise<number> {
    const filter: { _id?: mongoose.Types.ObjectId } = {};

    if (subscriptionPlanId) {
      filter._id = new mongoose.Types.ObjectId(subscriptionPlanId);
    }

    const count = await this._Subscription.aggregate([
      {
        $match: {
          endDate: { $gte: new Date() }, // Active subscriptions only
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          pipeline: [
            {
              $match: {
                email: search,
              },
            },
          ],
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "subscriptionplans",
          localField: "subscriptionPlanId",
          foreignField: "_id",
          pipeline: [
            {
              $match: {
                ...filter,
              },
            },
            {
              $project: {
                _id: 1,
              },
            },
          ],
          as: "subscriptionPlan",
        },
      },
      {
        $unwind: "$subscriptionPlan",
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
        },
      },
    ]);

    return count[0]?.count || 0;
  }

  public async getSubscribedUsers(
    search: RegExp,
    skip: number,
    limit: number,
    subscriptionPlanId: string | undefined
  ): Promise<Array<ISubscription>> {
    const filter: { _id?: mongoose.Types.ObjectId } = {};

    if (subscriptionPlanId) {
      filter._id = new mongoose.Types.ObjectId(subscriptionPlanId);
    }

    return await this._Subscription.aggregate([
      {
        $match: {
          endDate: { $gte: new Date() },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          pipeline: [
            {
              $match: {
                email: search,
              },
            },
            {
              $project: {
                username: 1,
                email: 1,
              },
            },
          ],
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "subscriptionplans",
          localField: "subscriptionPlanId",
          foreignField: "_id",
          pipeline: [
            {
              $match: {
                ...filter,
              },
            },
            {
              $project: {
                title: 1,
                price: 1,
              },
            },
          ],
          as: "subscriptionPlan",
        },
      },
      {
        $unwind: "$subscriptionPlan",
      },
      {
        $project: {
          startDate: 1,
          endDate: 1,
          user: 1,
          subscriptionPlan: 1,
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
}

export default SubscriptionRepository;
