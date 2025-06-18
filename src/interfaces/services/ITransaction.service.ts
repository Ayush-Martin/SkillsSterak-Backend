import { ITransaction } from "../../models/Transaction.model";

export interface ITransactionService {
  /** Retrieves a paginated list of transactions for a user. */
  getUserTransactions(
    userId: string,
    page: number,
    size: number
  ): Promise<{
    transactions: Array<ITransaction>;
    currentPage: number;
    totalPages: number;
  }>;

  /** Retrieves a paginated list of all transactions. */
  getTransactions(
    page: number,
    size: number
  ): Promise<{
    transactions: Array<ITransaction>;
    currentPage: number;
    totalPages: number;
  }>;
}
