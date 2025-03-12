import { Orders } from "razorpay/dist/types/orders";
import { ISubscription } from "../../models/Subscription.model";

export interface ISubscriptionService {
  createSubscriptionOrder(userId: string): Promise<Orders.RazorpayOrder>;
  completeSubscription(orderId: string): Promise<void>;
  getSubscriptionDetail(userId: string): Promise<ISubscription | null>;
}
