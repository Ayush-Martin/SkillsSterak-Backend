import { ITransaction } from "../../models/Transaction.model";

export interface ITransactionService {
  getUserTransactions(
    userId: string,
    page: number
  ): Promise<{
    transactions: Array<ITransaction>;
    currentPage: number;
    totalPages: number;
  }>;
  getTransactions(page: number): Promise<{
    transactions: Array<ITransaction>;
    currentPage: number;
    totalPages: number;
  }>;
}
