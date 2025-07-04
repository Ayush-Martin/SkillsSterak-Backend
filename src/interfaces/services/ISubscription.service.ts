import { Orders } from "razorpay/dist/types/orders";
import { ISubscription } from "../../models/Subscription.model";

export interface ISubscriptionService {
  /** Creates a new subscription order for a user */
  createSubscriptionOrder(userId: string): Promise<string>;
  /** Completes a subscription purchase */
  completeSubscription(
    userId: string,
    stripeSubscriptionId: string
  ): Promise<void>;
  deactivateSubscription(userId: string): Promise<void>;
  activateSubscription(userId: string): Promise<void>;
  /** Retrieves subscription detail by user id */
  getSubscriptionDetail(userId: string): Promise<ISubscription | null>;
}
