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
    return await this.Subscription.findOne({ userId });
  }
}

export default SubscriptionRepository;
