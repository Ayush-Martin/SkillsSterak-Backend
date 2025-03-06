import { ITransaction } from "../../models/Transaction.model";
import { IBaseRepository } from "./IBase.repository";

export interface ITransactionRepository extends IBaseRepository<ITransaction> {
  getUserTransactions(
    userId: string,
    skip: number,
    limit: number
  ): Promise<Array<ITransaction>>;
  getUserTransactionCount(userId: string): Promise<number>;
  getTransactions(skip: number, limit: number): Promise<Array<ITransaction>>;
  getTransactionCount(): Promise<number>;
}
