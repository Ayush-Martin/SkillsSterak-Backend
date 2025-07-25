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
import { WalletMessage } from "../constants/responseMessages";

class WalletService implements IWalletService {
  constructor(
    private _walletRepository: IWalletRepository,
    private _transactionRepository: ITransactionRepository,
    private _userRepository: IUserRepository
  ) {}

  public async getUserWalletInfo(userId: string): Promise<{
    balance: number;
  }> {
    const user = await this._userRepository.findById(userId);

    const wallet = await this._walletRepository.getUserWalletInfo(userId);
    if (!wallet) {
      await this._walletRepository.create({
        userId: getObjectId(userId),
      });
    }

    return { balance: wallet?.balance || 0 };
  }

  public async setUpStripeUserAccount(userId: string): Promise<string> {
    const user = (await this._userRepository.findById(userId))!;
    let stripeAccountId = user.stripeAccountId!;

    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: user.email,
        capabilities: { transfers: { requested: true } },
      });

      stripeAccountId = account.id;

      await this._userRepository.updateStripeAccountId(userId, account.id);
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
    const wallet = (await this._walletRepository.getUserWalletInfo(userId))!;
    const user = (await this._userRepository.findById(userId))!;

    if (!user.stripeAccountId) {
      throw errorCreator(
        WalletMessage.NoStripeAccount,
        StatusCodes.BAD_REQUEST
      );
    }

    if (wallet?.balance <= 0) {
      throw errorCreator(
        WalletMessage.NoEnoughBalance,
        StatusCodes.BAD_REQUEST
      );
    }

    const transfer = await stripe.transfers.create({
      amount: Math.round((wallet.balance * 100) / 83.2),
      currency: "usd",
      destination: user.stripeAccountId,
      description: "Wallet Redeem",
    });

    await this._walletRepository.debitWallet(userId, wallet.balance);
    await this._transactionRepository.create({
      receiverId: getObjectId(userId),
      amount: wallet.balance,
      type: "wallet_redeem",
      status: "completed",
    });
  }

  public async creditWallet(userId: string, amount: number): Promise<void> {
    await this._walletRepository.creditWallet(userId, amount);
  }
}

export default WalletService;
