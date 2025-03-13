import { IWallet } from "../../models/Wallet.model";
import BaseRepository from "../../repositories/Base.repository";

export interface IWalletRepository extends BaseRepository<IWallet> {
  /** Credits user's wallet with the given amount*/
  creditWallet(userId: string, amount: number): Promise<IWallet>;
  /** Redeems user's wallet for the given amount*/
  redeemWallet(userId: string, amount: number): Promise<IWallet | null>;
  /** Retrieves user's wallet info*/
  getUserWalletInfo(userId: string): Promise<IWallet | null>;
}
