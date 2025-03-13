import { ITransaction } from "../../models/Transaction.model";

export interface ITransactionService {
  /** Get user transactions*/
  getUserTransactions(
    userId: string,
    page: number
  ): Promise<{
    transactions: Array<ITransaction>;
    currentPage: number;
    totalPages: number;
  }>;
  /** Get all transactions*/
  getTransactions(page: number): Promise<{
    transactions: Array<ITransaction>;
    currentPage: number;
    totalPages: number;
  }>;
}
