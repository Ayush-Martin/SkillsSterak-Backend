import { ITransactionRepository } from "../interfaces/repositories/ITransaction.repository";
import { ITransactionService } from "../interfaces/services/ITransaction.service";
import { ITransaction } from "../models/Transaction.model";

class TransactionService implements ITransactionService {
  constructor(private transactionRepository: ITransactionRepository) {}

  public async getUserTransactions(
    userId: string,
    page: number,
    size: number
  ): Promise<{
    transactions: Array<ITransaction>;
    currentPage: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * size;

    const transactions = await this.transactionRepository.getUserTransactions(
      userId,
      skip,
      size
    );

    const totalTransactions =
      await this.transactionRepository.getUserTransactionCount(userId);
    const totalPages = Math.ceil(totalTransactions / size);
    return { transactions, currentPage: page, totalPages };
  }

  public async getTransactions(
    page: number,
    size: number
  ): Promise<{
    transactions: Array<ITransaction>;
    currentPage: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * size;
    const transactions = await this.transactionRepository.getTransactions(
      skip,
      size
    );
    const totalTransactions =
      await this.transactionRepository.getTransactionCount();

    const totalPages = Math.ceil(totalTransactions / size);

    return { transactions, currentPage: page, totalPages };
  }
}

export default TransactionService;
