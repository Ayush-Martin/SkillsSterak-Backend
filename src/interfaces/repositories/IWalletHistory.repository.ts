import { IWalletHistory } from "../../models/WalletHistory.model";
import { IBaseRepository } from "./IBase.repository";

export interface IWalletHistoryRepository
  extends IBaseRepository<IWalletHistory> {
  getWalletHistory(
    userId: string,
    skip: number,
    limit: number
  ): Promise<IWalletHistory[]>;

  getWalletHistoryCount(userId: string): Promise<number>;
}
