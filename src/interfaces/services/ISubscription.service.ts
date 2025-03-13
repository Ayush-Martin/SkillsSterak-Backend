import { Orders } from "razorpay/dist/types/orders";
import { ISubscription } from "../../models/Subscription.model";

export interface ISubscriptionService {
  /** Creates a new subscription order for a user */
  createSubscriptionOrder(userId: string): Promise<Orders.RazorpayOrder>;
  /** Completes a subscription purchase */
  completeSubscription(orderId: string): Promise<void>;
  /** Retrieves subscription detail by user id */
  getSubscriptionDetail(userId: string): Promise<ISubscription | null>;
}
