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

  /**
   * Deactivates a user's subscription.
   * Supports cancellation, trial expiration, and access revocation.
   */
  deactivateSubscription(userId: string): Promise<ISubscription | null>;

  /**
   * Activates a user's subscription with a specific start and end date.
   * Enables onboarding, renewals, and scheduled access.
   */
  activateSubscription(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ISubscription | null>;
}
