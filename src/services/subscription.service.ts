import { Orders } from "razorpay/dist/types/orders";
import { ISubscriptionRepository } from "../interfaces/repositories/ISubscription.repository";
import { ITransactionRepository } from "../interfaces/repositories/ITransaction.repository";
import { ISubscriptionService } from "../interfaces/services/ISubscription.service";
import razorpay from "../config/razorpay";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../utils/statusCodes";
import mongoose from "mongoose";
import { getThreeMonthsFromNow } from "../utils/date";

class SubscriptionService implements ISubscriptionService {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private transactionRepository: ITransactionRepository
  ) {}

  public async createSubscriptionOrder(
    userId: string
  ): Promise<Orders.RazorpayOrder> {
    const order = await razorpay.orders.create({
      amount: 1000 * 100, // amount in paise
      currency: "INR",
      receipt: "order_rcpt_id_11",
      notes: {
        userId,
      },
    });

    return order;
  }

  public async completeSubscription(orderId: string): Promise<void> {
    const order = await razorpay.orders.fetch(orderId);

    const userId = order.notes?.userId;

    if (!userId) {
      return errorCreator("Order not found", StatusCodes.NOT_FOUND);
    }

    if (order.status !== "paid") {
      return errorCreator("Order not paid", StatusCodes.BAD_REQUEST);
    }

    const transaction = await this.transactionRepository.create({
      payerId: userId as unknown as mongoose.Schema.Types.ObjectId,
      amount: 1000,
      type: "subscription",
      transactionId: orderId,
    });

    await this.subscriptionRepository.create({
      userId: userId as unknown as mongoose.Schema.Types.ObjectId,
      transactionId: transaction._id as mongoose.Schema.Types.ObjectId,
      endDate: getThreeMonthsFromNow(),
    });
  }
}

export default SubscriptionService;
