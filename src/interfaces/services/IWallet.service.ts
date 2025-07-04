import { IWallet } from "../../models/Wallet.model";

export interface IWalletService {
  /** Retrieves user's wallet info */
  getUserWalletInfo(userId: string): Promise<{
    balance: number;
    commission?: number;
    redeemable?: number;
  }>;
  /** Redeems user's wallet */
  redeem(userId: string): Promise<void>;
  setUpStripeUserAccount(userId: string): Promise<string>;
}
