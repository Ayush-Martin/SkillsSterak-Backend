import { Model } from "mongoose";
import { IWalletHistoryRepository } from "../interfaces/repositories/IWalletHistory.repository";
import { IWalletHistory } from "../models/WalletHistory.model";
import BaseRepository from "./Base.repository";

class WalletHistoryRepository
  extends BaseRepository<IWalletHistory>
  implements IWalletHistoryRepository
{
  constructor(private _WalletHistory: Model<IWalletHistory>) {
    super(_WalletHistory);
  }

  public async getWalletHistoryCount(userId: string): Promise<number> {
    return this._WalletHistory.countDocuments({ userId });
  }

  public async getWalletHistory(
    userId: string,
    skip: number,
    limit: number
  ): Promise<IWalletHistory[]> {
    return await this._WalletHistory.find({ userId }).skip(skip).limit(limit);
  }
}

export default WalletHistoryRepository;
