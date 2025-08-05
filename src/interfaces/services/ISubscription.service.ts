import { ISubscription } from "../../models/Subscription.model";

export interface ISubscriptionService {
  /**
   * Initiates a new subscription order for a user. Used to start the payment process and generate an order reference.
   */
  createSubscriptionOrder(userId: string, planId: string): Promise<string>;

  /**
   * Finalizes a subscription purchase after successful payment. Used to activate premium features for the user.
   */
  completeSubscription(
    userId: string,
    planId: string,
    transactionId: string
  ): Promise<void>;

  /**
   * Retrieves the current subscription details for a user. Used to display status, renewal, and plan information.
   */
  getSubscriptionDetail(userId: string): Promise<ISubscription | null>;

  getSubscribedUsers(
    search: string,
    page: number,
    size: number
  ): Promise<{
    subscribedUsers: Array<ISubscription>;
    currentPage: number;
    totalPages: number;
  }>;
}
