import { ITransactionRepository } from "../interfaces/repositories/ITransaction.repository";
import { IWalletRepository } from "../interfaces/repositories/IWallet.repository";
import { IWalletService } from "../interfaces/services/IWallet.service";
import { COURSE_COMMISSION_RATE } from "../constants/general";
import { getObjectId } from "../utils/objectId";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../constants/statusCodes";
import stripe from "../config/stripe";
import envConfig from "../config/env";
import { IWallet } from "../models/Wallet.model";

class WalletService implements IWalletService {
  constructor(
    private walletRepository: IWalletRepository,
    private transactionRepository: ITransactionRepository,
    private userRepository: IUserRepository
  ) {}

  public async getUserWalletInfo(userId: string): Promise<{
    balance: number;
    commission?: number;
    redeemable?: number;
  }> {
    const user = await this.userRepository.findById(userId);
    const isAdmin = user?.role === "admin";

    const wallet = await this.walletRepository.getUserWalletInfo(userId);
    if (!wallet) {
      await this.walletRepository.create({
        userId: getObjectId(userId),
      });

      if (isAdmin) return { balance: 0 };

      return {
        balance: 0,
        commission: 0,
        redeemable: 0,
      };
    }

    if (isAdmin) {
      return { balance: wallet.balance };
    }

    const calculatedCommission = wallet.balance * COURSE_COMMISSION_RATE;
    const calculatedRedeemableAmount = wallet.balance - calculatedCommission;
    return {
      balance: wallet.balance,
      commission: calculatedCommission,
      redeemable: calculatedRedeemableAmount,
    };
  }

  public async setUpStripeUserAccount(userId: string): Promise<string> {
    const user = (await this.userRepository.findById(userId))!;
    let stripeAccountId = user.stripeAccountId!;

    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: user.email,
        capabilities: { transfers: { requested: true } },
      });

      stripeAccountId = account.id;

      await this.userRepository.updateStripeAccountId(userId, account.id);
    }

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${envConfig.FRONTEND_DOMAIN}/user`,
      return_url: `${envConfig.FRONTEND_DOMAIN}/user`,
      type: "account_onboarding",
    });

    return accountLink.url;
  }

  public async redeem(userId: string): Promise<void> {
    const wallet = (await this.walletRepository.getUserWalletInfo(userId))!;
    const user = (await this.userRepository.findById(userId))!;
    const admin = (await this.userRepository.getAdmin())!;

    if (!user.stripeAccountId) {
      throw errorCreator(
        "Stripe account not setup for user",
        StatusCodes.BAD_REQUEST
      );
    }

    if (wallet?.balance <= 0) {
      throw errorCreator(
        "Cannot redeem, balance is 0",
        StatusCodes.BAD_REQUEST
      );
    }

    const adminCommission = wallet.balance * COURSE_COMMISSION_RATE;
    const redeemableAmount = wallet.balance - adminCommission;

    const transfer = await stripe.transfers.create({
      amount: Math.round((redeemableAmount * 100) / 83.2), // convert to usd
      currency: "usd",
      destination: user.stripeAccountId,
      description: "Wallet Redeem",
    });

    await this.walletRepository.debitWallet(userId, wallet.balance); // convert back to rupees
    await this.walletRepository.creditWallet(admin.id, adminCommission);
    await this.transactionRepository.create({
      receiverId: getObjectId(userId),
      amount: redeemableAmount,
      type: "redeem",
    });
    await this.transactionRepository.create({
      payerId: getObjectId(userId),
      amount: adminCommission,
      type: "commission",
    });
  }
}

export default WalletService;
