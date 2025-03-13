import { Orders } from "razorpay/dist/types/orders";
import { ISubscriptionRepository } from "../interfaces/repositories/ISubscription.repository";
import { ITransactionRepository } from "../interfaces/repositories/ITransaction.repository";
import { ISubscriptionService } from "../interfaces/services/ISubscription.service";
import razorpay from "../config/razorpay";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../utils/statusCodes";
import { getThreeMonthsFromNow } from "../utils/date";
import { ISubscription } from "../models/Subscription.model";
import {
  ORDER_NOT_FOUND_ERROR_MESSAGE,
  ORDER_NOT_PAID_ERROR_MESSAGE,
} from "../constants/responseMessages";
import { getObjectId } from "../utils/objectId";

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

    const userId = order.notes?.userId as string | undefined;

    if (!userId) {
      return errorCreator(ORDER_NOT_FOUND_ERROR_MESSAGE, StatusCodes.NOT_FOUND);
    }

    if (order.status !== "paid") {
      return errorCreator(
        ORDER_NOT_PAID_ERROR_MESSAGE,
        StatusCodes.BAD_REQUEST
      );
    }

    const transaction = await this.transactionRepository.create({
      payerId: getObjectId(userId),
      amount: 1000,
      type: "subscription",
      transactionId: orderId,
    });

    await this.subscriptionRepository.create({
      userId: getObjectId(userId),
      transactionId: getObjectId(transaction._id as string),
      endDate: getThreeMonthsFromNow(),
    });
  }

  public async getSubscriptionDetail(
    userId: string
  ): Promise<ISubscription | null> {
    return await this.subscriptionRepository.getSubscriptionDetailByUserID(
      userId
    );
  }
}

export default SubscriptionService;
