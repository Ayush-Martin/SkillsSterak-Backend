import { IWallet } from "../../models/Wallet.model";
import BaseRepository from "../../repositories/Base.repository";

/**
 * Repository interface for wallet-related data operations.
 * Supports user balance management, transactions, and redemption features.
 */
export interface IWalletRepository extends BaseRepository<IWallet> {
  /**
   * Credits (adds) an amount to a user's wallet balance.
   * Supports rewards, refunds, and manual adjustments.
   */
  creditWallet(userId: string, amount: number): Promise<IWallet>;

  /**
   * Debits (subtracts) an amount from a user's wallet balance.
   * Used for purchases, withdrawals, and penalties.
   */
  debitWallet(userId: string, amount: number): Promise<void>;

  /**
   * Redeems an amount from a user's wallet, returning the updated wallet or null if failed.
   * Supports coupon, offer, or payout redemption flows.
   */
  redeemWallet(userId: string, amount: number): Promise<IWallet | null>;

  /**
   * Retrieves wallet information for a user.
   * Enables balance display, transaction history, and account management.
   */
  getUserWalletInfo(userId: string): Promise<IWallet | null>;
}
