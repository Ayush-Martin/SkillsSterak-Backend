import {
  ITransaction,
  ITransactionStatus,
} from "../../models/Transaction.model";
import { IBaseRepository } from "./IBase.repository";

export interface ITransactionRepository extends IBaseRepository<ITransaction> {
  /** Get user transactions */
  getUserTransactions(
    userId: string,
    skip: number,
    limit: number,
    search: RegExp,
    filter: Record<string, any>
  ): Promise<Array<ITransaction>>;

  /** Get user transaction count */
  getUserTransactionCount(
    userId: string,
    search: RegExp,
    filter: Record<string, any>
  ): Promise<number>;

  /** Get all transactions */
  getTransactions(
    skip: number,
    limit: number,
    search: RegExp,
    filter: Record<string, any>
  ): Promise<Array<ITransaction>>;

  /** Get total transaction count */
  getTransactionCount(
    search: RegExp,
    filter: Record<string, any>
  ): Promise<number>;

  /**
   * Retrieves admin revenue transactions with optional filtering and pagination.
   * Supports financial reporting and dashboard analytics for platform administrators.
   */
  getAdminRevenue(
    filter: Record<string, any>,
    skip?: number,
    limit?: number
  ): Promise<ITransaction>;

  /**
   * Retrieves trainer revenue transactions with optional filtering and pagination.
   * Enables trainers to track their earnings and financial performance.
   */
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

  changePaymentStatus(
    transactionId: string,
    status: ITransactionStatus
  ): Promise<ITransaction | null>;

  updateOnProcessPurchaseTransactions(): Promise<Array<ITransaction>>;
}
