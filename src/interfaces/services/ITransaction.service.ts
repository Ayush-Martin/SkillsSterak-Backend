import { ITransaction } from "../../models/Transaction.model";

export interface ITransactionService {
  getUserTransactions(
    userId: string,
    page: number,
    size: number
  ): Promise<{
    transactions: Array<ITransaction>;
    currentPage: number;
    totalPages: number;
  }>;

  getTransactions(page: number,size:number): Promise<{
    transactions: Array<ITransaction>;
    currentPage: number;
    totalPages: number;
  }>;
}
