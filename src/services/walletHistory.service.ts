import { IWalletHistoryRepository } from "../interfaces/repositories/IWalletHistory.repository";
import { IWalletHistoryService } from "../interfaces/services/IWalletHistory.service";
import { IWalletHistory } from "../models/WalletHistory.model";

class WalletHistoryService implements IWalletHistoryService {
  constructor(private _walletHistoryRepository: IWalletHistoryRepository) {}

  public async getWalletHistory(
    userId: string,
    page: number,
    size: number
  ): Promise<{
    walletHistory: Array<IWalletHistory>;
    currentPage: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * size;
    const walletHistory = await this._walletHistoryRepository.getWalletHistory(
      userId,
      skip,
      size
    );

    const totalWalletHistory =
      await this._walletHistoryRepository.getWalletHistoryCount(userId);
    const totalPages = Math.ceil(totalWalletHistory / size);
    return {
      walletHistory,
      currentPage: page,
      totalPages,
    };
  }
}

export default WalletHistoryService;
