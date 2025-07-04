import { ISubscription } from "../../models/Subscription.model";
import BaseRepository from "../../repositories/Base.repository";

export interface ISubscriptionRepository extends BaseRepository<ISubscription> {
  /** Retrieves subscription detail by user id */
  getSubscriptionDetailByUserID(userId: string): Promise<ISubscription | null>;
  deactivateSubscription(userId: string): Promise<ISubscription | null>;
  activateSubscription(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ISubscription | null>;
}
