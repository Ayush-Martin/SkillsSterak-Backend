import { RECORDS_PER_PAGE } from "../constants/general";
import { ITransactionRepository } from "../interfaces/repositories/ITransaction.repository";
import { ITransactionService } from "../interfaces/services/ITransaction.service";
import { ITransaction } from "../models/Transaction.model";

class TransactionService implements ITransactionService {
  constructor(private transactionRepository: ITransactionRepository) {}

  public async getUserTransactions(
    userId: string,
    page: number
  ): Promise<{
    transactions: Array<ITransaction>;
    currentPage: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * RECORDS_PER_PAGE;

    const transactions = await this.transactionRepository.getUserTransactions(
      userId,
      skip,
      RECORDS_PER_PAGE
    );

    const totalTransactions =
      await this.transactionRepository.getUserTransactionCount(userId);
    console.log(transactions, totalTransactions);
    const totalPages = Math.ceil(totalTransactions / RECORDS_PER_PAGE);
    return { transactions, currentPage: page, totalPages };
  }

  public async getTransactions(page: number): Promise<{
    transactions: Array<ITransaction>;
    currentPage: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * RECORDS_PER_PAGE;
    const transactions = await this.transactionRepository.getTransactions(
      skip,
      RECORDS_PER_PAGE
    );
    const totalTransactions =
      await this.transactionRepository.getTransactionCount();

    const totalPages = Math.ceil(totalTransactions / RECORDS_PER_PAGE);

    return { transactions, currentPage: page, totalPages };
  }
}

export default TransactionService;
