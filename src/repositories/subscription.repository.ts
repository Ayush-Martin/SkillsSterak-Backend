import { Model } from "mongoose";
import { ISubscription } from "../models/Subscription.model";
import BaseRepository from "./Base.repository";
import { ISubscriptionRepository } from "../interfaces/repositories/ISubscription.repository";

class SubscriptionRepository
  extends BaseRepository<ISubscription>
  implements ISubscriptionRepository
{
  constructor(private Subscription: Model<ISubscription>) {
    super(Subscription);
  }

  public async getSubscriptionDetailByUserID(
    userId: string
  ): Promise<ISubscription | null> {
    return await this.Subscription.findOne(
      { userId },
      { startDate: 1, endDate: 1, active: 1 }
    );
  }

  public async activateSubscription(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ISubscription | null> {
    return await this.Subscription.findOneAndUpdate(
      { userId },
      {
        $set: { startDate, endDate, active: true },
      },
      { upsert: true }
    );
  }

  public async deactivateSubscription(
    userId: string
  ): Promise<ISubscription | null> {
    return await this.Subscription.findOneAndUpdate(
      { userId },
      {
        $set: { active: false },
      }
    );
  }
}

export default SubscriptionRepository;
