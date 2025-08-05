import { ISubscription } from "../../models/Subscription.model";
import BaseRepository from "../../repositories/Base.repository";

/**
 * Repository interface for subscription-related data operations.
 * Supports user access control, subscription lifecycle, and billing features.
 */
export interface ISubscriptionRepository extends BaseRepository<ISubscription> {
  /**
   * Retrieves the subscription details for a user by their ID.
   * Enables access checks and personalized subscription management.
   */
  getSubscriptionDetailByUserID(userId: string): Promise<ISubscription | null>;

  getSubscribedUsersCount(search: RegExp): Promise<number>;

  getSubscribedUsers(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<ISubscription>>;
}
