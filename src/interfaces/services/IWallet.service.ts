import { IWallet } from "../../models/Wallet.model";

export interface IWalletService {
  getUserWalletInfo(userId: string): Promise<{
    balance: number;
    commission: number;
    redeemable: number;
  }>;
  redeem(userId: string): Promise<void>;
}
