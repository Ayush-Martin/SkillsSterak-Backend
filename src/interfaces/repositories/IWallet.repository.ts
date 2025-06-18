import { IWallet } from "../../models/Wallet.model";
import BaseRepository from "../../repositories/Base.repository";

export interface IWalletRepository extends BaseRepository<IWallet> {
  /** Credit an amount to a user's wallet */
  creditWallet(userId: string, amount: number): Promise<IWallet>;
  /** Debit an amount from a user's wallet */
  debitWallet(userId: string, amount: number): Promise<void>;
  /** Redeem an amount from a user's wallet */
  redeemWallet(userId: string, amount: number): Promise<IWallet | null>;
  /** Get wallet info for a user */
  getUserWalletInfo(userId: string): Promise<IWallet | null>;
}
