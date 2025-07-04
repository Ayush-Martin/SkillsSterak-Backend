import { IWallet } from "../../models/Wallet.model";

export interface IWalletService {
  /**
   * Returns the wallet information for a user, including balance and commission. Used for displaying wallet status and enabling financial actions.
   */
  getUserWalletInfo(userId: string): Promise<{
    balance: number;
    commission?: number;
    redeemable?: number;
  }>;

  /**
   * Initiates a wallet redemption for a user. Used to allow users to withdraw or redeem their available balance.
   */
  redeem(userId: string): Promise<void>;

  /**
   * Sets up a Stripe account for a user. Used to enable payouts and financial integrations.
   */
  setUpStripeUserAccount(userId: string): Promise<string>;
}
