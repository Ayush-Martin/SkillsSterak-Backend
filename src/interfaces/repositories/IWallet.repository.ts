import { IWallet } from "../../models/Wallet.model";
import BaseRepository from "../../repositories/Base.repository";

export interface IWalletRepository extends BaseRepository<IWallet> {
  creditWallet(userId: string, amount: number): Promise<IWallet>;
  debitWallet(userId: string, amount: number): Promise<void>;
  redeemWallet(userId: string, amount: number): Promise<IWallet | null>;
  getUserWalletInfo(userId: string): Promise<IWallet | null>;
}
