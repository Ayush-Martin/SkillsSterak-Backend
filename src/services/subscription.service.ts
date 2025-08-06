import { ISubscriptionRepository } from "../interfaces/repositories/ISubscription.repository";
import { ITransactionRepository } from "../interfaces/repositories/ITransaction.repository";
import { ISubscriptionService } from "../interfaces/services/ISubscription.service";
import { ISubscription } from "../models/Subscription.model";
import { getObjectId } from "../utils/objectId";
import stripe from "../config/stripe";
import envConfig from "../config/env";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { ISubscriptionPlanRepository } from "../interfaces/repositories/ISubscriptionPlan.repository";

class SubscriptionService implements ISubscriptionService {
  constructor(
    private _subscriptionRepository: ISubscriptionRepository,
    private _transactionRepository: ITransactionRepository,
    private _userRepository: IUserRepository,
    private _subscriptionPlanRepository: ISubscriptionPlanRepository
  ) {}

  public async createSubscriptionOrder(
    userId: string,
    planId: string
  ): Promise<string> {
    const userEmail = await this._userRepository.getUserEmail(userId);

    const plan = (await this._subscriptionPlanRepository.findById(planId))!;

    console.log(plan, planId);

    const transaction = await this._transactionRepository.create({
      payerId: getObjectId(userId),
      amount: plan.price,
      type: "subscription",
      status: "pending",
      method: "stripe",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: plan.title,
              description: plan.description,
            },
            unit_amount: plan.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: envConfig.FRONTEND_DOMAIN + "/payment/success",
      cancel_url: envConfig.FRONTEND_DOMAIN + "/payment/failure",
      metadata: {
        userId,
        planId,
        transactionId: transaction.id,
      },
      customer_email: userEmail,
    });

    return session.id;
  }

  public async completeSubscription(
    userId: string,
    planId: string,
    transactionId: string
  ): Promise<void> {
    const plan = (await this._subscriptionPlanRepository.findById(planId))!;

    await this._transactionRepository.changePaymentStatus(
      transactionId,
      "completed"
    );

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    await this._subscriptionRepository.create({
      userId: getObjectId(userId),
      transactionId: getObjectId(transactionId),
      subscriptionPlanId: getObjectId(planId),
      startDate: new Date(),
      endDate,
    });
  }

  public async getSubscriptionDetail(
    userId: string
  ): Promise<ISubscription | null> {
    return await this._subscriptionRepository.getSubscriptionDetailByUserID(
      userId
    );
  }

  public async getSubscribedUsers(
    search: string,
    page: number,
    size: number,
    subscriptionPlanId: string | undefined
  ): Promise<{
    subscribedUsers: Array<ISubscription>;
    currentPage: number;
    totalPages: number;
  }> {
    const searchRegex = new RegExp(search, "i");
    const skip = (page - 1) * size;
    const subscribedUsers =
      await this._subscriptionRepository.getSubscribedUsers(
        searchRegex,
        skip,
        size,
        subscriptionPlanId
      );
    const totalSubscribedUsers =
      await this._subscriptionRepository.getSubscribedUsersCount(
        searchRegex,
        subscriptionPlanId
      );
    const totalPages = Math.ceil(totalSubscribedUsers / size);
    return {
      subscribedUsers,
      currentPage: page,
      totalPages,
    };
  }
}

export default SubscriptionService;
