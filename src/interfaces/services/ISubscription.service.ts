import { ISubscription } from "../../models/Subscription.model";

export interface ISubscriptionService {
  /**
   * Initiates a new subscription order for a user. Used to start the payment process and generate an order reference.
   */
  createSubscriptionOrder(userId: string): Promise<string>;

  /**
   * Finalizes a subscription purchase after successful payment. Used to activate premium features for the user.
   */
  completeSubscription(
    userId: string,
    stripeSubscriptionId: string
  ): Promise<void>;

  /**
   * Temporarily disables a user's subscription. Used for failed payments, user requests, or account management.
   */
  deactivateSubscription(userId: string): Promise<void>;

  /**
   * Reactivates a previously deactivated subscription. Used to restore access after payment or upon user request.
   */
  activateSubscription(userId: string): Promise<void>;

  /**
   * Retrieves the current subscription details for a user. Used to display status, renewal, and plan information.
   */
  getSubscriptionDetail(userId: string): Promise<ISubscription | null>;
}
