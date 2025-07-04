
import { ISubscriptionRepository } from "../interfaces/repositories/ISubscription.repository";
import { ITransactionRepository } from "../interfaces/repositories/ITransaction.repository";
import { ISubscriptionService } from "../interfaces/services/ISubscription.service";
import { getNextMonth } from "../utils/date";
import { ISubscription } from "../models/Subscription.model";
import { getObjectId } from "../utils/objectId";
import stripe from "../config/stripe";
import envConfig from "../config/env";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";

class SubscriptionService implements ISubscriptionService {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private transactionRepository: ITransactionRepository,
    private userRepository: IUserRepository
  ) {}

  public async createSubscriptionOrder(userId: string): Promise<string> {
    const userEmail = await this.userRepository.getUserEmail(userId);

    const session = await stripe.checkout.sessions.create({
      success_url: envConfig.FRONTEND_DOMAIN,
      cancel_url: envConfig.FRONTEND_DOMAIN,
      line_items: [
        {
          price: envConfig.STRIPE_SUBSCRIPTION_PREMIUM_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        metadata: {
          userId,
        },
      },
      customer_email: userEmail,
    });

    return session.id;
  }

  public async completeSubscription(userId: string): Promise<void> {

    const transaction = await this.transactionRepository.create({
      payerId: getObjectId(userId),
      amount: 5000,
      type: "subscription",
    });

    await this.subscriptionRepository.create({
      userId: getObjectId(userId),
      transactionId: getObjectId(transaction._id as string),
      endDate: getNextMonth(),
      active: true,
    });
  }

  public async deactivateSubscription(
    stripeSubscriptionId: string
  ): Promise<void> {
    await this.subscriptionRepository.deactivateSubscription(
      stripeSubscriptionId
    );
  }

  public async activateSubscription(userId: string): Promise<void> {
    await this.subscriptionRepository.activateSubscription(
      userId,
      new Date(),
      getNextMonth()
    );
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
