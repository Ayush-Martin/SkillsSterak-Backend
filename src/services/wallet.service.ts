import mongoose from "mongoose";
import { ITransactionRepository } from "../interfaces/repositories/ITransaction.repository";
import { IWalletRepository } from "../interfaces/repositories/IWallet.repository";
import { IWalletService } from "../interfaces/services/IWallet.service";
import { COURSE_COMMISSION_RATE } from "../constants/general";

class WalletService implements IWalletService {
  constructor(
    private walletRepository: IWalletRepository,
    private transactionRepository: ITransactionRepository
  ) {}

  public async getUserWalletInfo(userId: string): Promise<{
    balance: number;
    commission: number;
    redeemable: number;
  }> {
    const wallet = await this.walletRepository.getUserWalletInfo(userId);
    if (!wallet) {
      await this.walletRepository.create({
        userId: userId as unknown as mongoose.Schema.Types.ObjectId,
      });

      return { balance: 0, commission: 0, redeemable: 0 };
    }

    const calculatedCommission = wallet.balance * COURSE_COMMISSION_RATE;
    const calculatedRedeemableAmount = wallet.balance - calculatedCommission;
    console.log(calculatedCommission, calculatedRedeemableAmount, wallet);
    return {
      balance: wallet.balance,
      commission: calculatedCommission,
      redeemable: calculatedRedeemableAmount,
    };
  }

  public async redeem(userId: string): Promise<void> {}
}

export default WalletService;
