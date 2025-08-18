import { IWalletHistory } from "../../models/WalletHistory.model";

export interface IWalletHistoryService {
  getWalletHistory(
    userId: string,
    page: number,
    size: number
  ): Promise<{
    walletHistory: Array<IWalletHistory>;
    currentPage: number;
    totalPages: number;
  }>;
}
