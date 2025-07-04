import { ITransaction } from "../../models/Transaction.model";
import { IBaseRepository } from "./IBase.repository";

export interface ITransactionRepository extends IBaseRepository<ITransaction> {
  /** Get user transactions */
  getUserTransactions(
    userId: string,
    skip: number,
    limit: number
  ): Promise<Array<ITransaction>>;

  /** Get user transaction count */
  getUserTransactionCount(userId: string): Promise<number>;

  /** Get all transactions */
  getTransactions(skip: number, limit: number): Promise<Array<ITransaction>>;

  /** Get total transaction count */
  getTransactionCount(): Promise<number>;

  getAdminRevenue(
    filter: Record<string, any>,
    skip?: number,
    limit?: number
  ): Promise<ITransaction>;

  getTrainerRevenue(
    trainerId: string,
    filter: Record<string, any>,
    skip?: number,
    limit?: number
  ): Promise<ITransaction>;

  getAdminRevenueCount(filter: Record<string, any>): Promise<number>;

  getTrainerRevenueCount(
    trainerId: string,
    filter: Record<string, any>
  ): Promise<number>;

  getTrainerRevenueGraphData(trainerId: string): Promise<ITransaction>;
  getAdminRevenueGraphData(): Promise<ITransaction>;
}
