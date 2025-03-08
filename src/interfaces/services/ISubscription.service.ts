import { Orders } from "razorpay/dist/types/orders";

export interface ISubscriptionService {
  createSubscriptionOrder(userId: string): Promise<Orders.RazorpayOrder>;
  completeSubscription(orderId: string): Promise<void>;
}
