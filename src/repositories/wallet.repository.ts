import { Model } from "mongoose";
import { IWalletRepository } from "../interfaces/repositories/IWallet.repository";
import BaseRepository from "./Base.repository";
import { IWallet } from "../models/Wallet.model";

class WalletRepository
  extends BaseRepository<IWallet>
  implements IWalletRepository
{
  constructor(private _Wallet: Model<IWallet>) {
    super(_Wallet);
  }

  public async creditWallet(userId: string, amount: number): Promise<IWallet> {
    return await this._Wallet.findOneAndUpdate(
      { userId },
      { $inc: { balance: amount } },
      { new: true, upsert: true }
    );
  }

  public async debitWallet(userId: string, amount: number): Promise<void> {
    await this._Wallet.findOneAndUpdate(
      { userId },
      { $inc: { balance: -amount } },
      { new: true }
    );
  }

  public async redeemWallet(userId: string): Promise<IWallet | null> {
    return await this._Wallet.findOneAndUpdate(
      { userId },
      { balance: 0 },
      { new: true }
    );
  }

  public async getUserWalletInfo(userId: string): Promise<IWallet | null> {
    return await this._Wallet.findOne({ userId });
  }
}

export default WalletRepository;
