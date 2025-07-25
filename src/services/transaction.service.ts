import { ITransactionRepository } from "../interfaces/repositories/ITransaction.repository";
import { ITransactionService } from "../interfaces/services/ITransaction.service";
import { ITransaction, ITransactionStatus } from "../models/Transaction.model";
import { IFilterType } from "../types/revenueType";
import { Buffer } from "exceljs";
import {
  generateAdminRevenuePdf,
  generateTrainerRevenuePdf,
} from "../utils/pdf";
import {
  generateAdminRevenueExcel,
  generateTrainerRevenueExcel,
} from "../utils/excel";
import { IWalletRepository } from "../interfaces/repositories/IWallet.repository";

class TransactionService implements ITransactionService {
  constructor(
    private _transactionRepository: ITransactionRepository,
    private _walletRepository: IWalletRepository
  ) {}

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

    const transactions = await this._transactionRepository.getUserTransactions(
      userId,
      skip,
      size
    );

    const totalTransactions =
      await this._transactionRepository.getUserTransactionCount(userId);
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
    const transactions = await this._transactionRepository.getTransactions(
      skip,
      size
    );
    const totalTransactions =
      await this._transactionRepository.getTransactionCount();

    const totalPages = Math.ceil(totalTransactions / size);

    return { transactions, currentPage: page, totalPages };
  }

  public async getAdminRevenue(
    page: number,
    size: number,
    filterType: IFilterType,
    startDate?: string,
    endDate?: string
  ): Promise<{
    revenue: ITransaction;
    currentPage: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * size;

    let filter: Record<string, any> = {};

    if (filterType !== "all") {
      let fromDate = new Date();
      let toDate = new Date();

      switch (filterType) {
        case "daily":
          fromDate.setHours(0, 0, 0, 0);
          toDate.setHours(23, 59, 59, 999);
          break;
        case "monthly":
          fromDate.setMonth(fromDate.getMonth() - 1);
          break;
        case "yearly":
          fromDate.setFullYear(fromDate.getFullYear() - 1);
          break;
        case "custom":
          if (startDate) fromDate = new Date(startDate);
          if (endDate) toDate = new Date(endDate);
          toDate.setHours(23, 59, 59, 999);
          break;
      }

      filter = { createdAt: { $gte: fromDate, $lte: toDate } };
    }

    const revenue = await this._transactionRepository.getAdminRevenue(
      filter,
      skip,
      size
    );

    const totalTransactions =
      await this._transactionRepository.getAdminRevenueCount(filter);

    const totalPages = Math.ceil(totalTransactions / size);

    return { revenue, currentPage: page, totalPages };
  }

  public async exportAdminRevenue(
    filterType: IFilterType,
    startDate: string,
    endDate: string,
    exportType: "pdf" | "excel"
  ): Promise<PDFKit.PDFDocument | Buffer> {
    let filter: Record<string, any> = {};

    let fromDate = new Date();
    let toDate = new Date();

    if (filterType !== "all") {
      switch (filterType) {
        case "daily":
          fromDate.setHours(0, 0, 0, 0);
          toDate.setHours(23, 59, 59, 999);
          break;
        case "monthly":
          fromDate.setMonth(fromDate.getMonth() - 1);
          break;
        case "yearly":
          fromDate.setFullYear(fromDate.getFullYear() - 1);
          break;
        case "custom":
          if (startDate) fromDate = new Date(startDate);
          if (endDate) toDate = new Date(endDate);
          toDate.setHours(23, 59, 59, 999);
          break;
      }

      filter = { createdAt: { $gte: fromDate, $lte: toDate } };
    }

    const revenue = (await this._transactionRepository.getAdminRevenue(
      filter
    )) as unknown as {
      totalRevenue: number;
      commissionRevenue: number;
      subscriptionRevenue: number;
      transactions: Array<{ payer: string; type: string; amount: string }>;
    };

    if (exportType === "pdf") {
      return generateAdminRevenuePdf(
        revenue.totalRevenue,
        revenue.commissionRevenue,
        revenue.subscriptionRevenue,
        revenue.transactions,
        filterType === "all" ? undefined : fromDate,
        filterType === "all" ? undefined : toDate
      );
    } else {
      return generateAdminRevenueExcel(
        revenue.totalRevenue,
        revenue.commissionRevenue,
        revenue.subscriptionRevenue,
        revenue.transactions,
        filterType === "all" ? undefined : fromDate,
        filterType === "all" ? undefined : toDate
      );
    }
  }

  public async getTrainerRevenue(
    trainerId: string,
    page: number,
    size: number,
    filterType: IFilterType,
    startDate: string,
    endDate: string
  ): Promise<{
    revenue: ITransaction;
    currentPage: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * size;

    let filter: Record<string, any> = {};

    if (filterType !== "all") {
      let fromDate = new Date();
      let toDate = new Date();

      switch (filterType) {
        case "daily":
          fromDate.setHours(0, 0, 0, 0);
          toDate.setHours(23, 59, 59, 999);
          break;
        case "monthly":
          fromDate.setMonth(fromDate.getMonth() - 1);
          break;
        case "yearly":
          fromDate.setFullYear(fromDate.getFullYear() - 1);
          break;
        case "custom":
          if (startDate) fromDate = new Date(startDate);
          if (endDate) toDate = new Date(endDate);
          toDate.setHours(23, 59, 59, 999);
          break;
      }

      filter = { createdAt: { $gte: fromDate, $lte: toDate } };
    }

    const revenue = await this._transactionRepository.getTrainerRevenue(
      trainerId,
      filter,
      skip,
      size
    );

    const totalTransactions =
      await this._transactionRepository.getTrainerRevenueCount(
        trainerId,
        filter
      );

    const totalPages = Math.ceil(totalTransactions / size);

    return { revenue, currentPage: page, totalPages };
  }

  public async exportTrainerRevenue(
    trainerId: string,
    filterType: IFilterType,
    startDate: string,
    endDate: string,
    exportType: "pdf" | "excel"
  ): Promise<PDFKit.PDFDocument | Buffer> {
    let filter: Record<string, any> = {};

    let fromDate = new Date();
    let toDate = new Date();

    if (filterType !== "all") {
      switch (filterType) {
        case "daily":
          fromDate.setHours(0, 0, 0, 0);
          toDate.setHours(23, 59, 59, 999);
          break;
        case "monthly":
          fromDate.setMonth(fromDate.getMonth() - 1);
          break;
        case "yearly":
          fromDate.setFullYear(fromDate.getFullYear() - 1);
          break;
        case "custom":
          if (startDate) fromDate = new Date(startDate);
          if (endDate) toDate = new Date(endDate);
          toDate.setHours(23, 59, 59, 999);
          break;
      }

      filter = { createdAt: { $gte: fromDate, $lte: toDate } };
    }

    const revenue = (await this._transactionRepository.getTrainerRevenue(
      trainerId,
      filter
    )) as unknown as {
      totalRevenue: number;
      totalCommission: number;
      onProcessAmount: number;
      transactions: Array<{
        payer: string;
        course: string;
        amount: string;
        status: string;
        adminCommission: number;
      }>;
    };

    if (exportType === "pdf") {
      return generateTrainerRevenuePdf(
        revenue.totalRevenue,
        revenue.totalCommission,
        revenue.onProcessAmount,
        revenue.transactions,
        filterType === "all" ? undefined : fromDate,
        filterType === "all" ? undefined : toDate
      );
    } else {
      return generateTrainerRevenueExcel(
        revenue.totalRevenue,
        revenue.totalCommission,
        revenue.onProcessAmount,
        revenue.transactions,
        filterType === "all" ? undefined : fromDate,
        filterType === "all" ? undefined : toDate
      );
    }
  }

  public async getAdminRevenueGraphData(): Promise<ITransaction> {
    return await this._transactionRepository.getAdminRevenueGraphData();
  }

  public async getTrainerRevenueGraphData(
    trainerId: string
  ): Promise<ITransaction> {
    return await this._transactionRepository.getTrainerRevenueGraphData(
      trainerId
    );
  }

  public async completeTransaction(
    transactionId: string
  ): Promise<ITransaction | null> {
    return await this._transactionRepository.changePaymentStatus(
      transactionId,
      "completed"
    );
  }

  public async cancelTransaction(
    userId: string,
    transactionId: string
  ): Promise<ITransaction | null> {
    const transaction = await this._transactionRepository.findById(
      transactionId
    );

    await this._walletRepository.creditWallet(userId, transaction?.amount!);

    return await this._transactionRepository.changePaymentStatus(
      transactionId,
      "canceled"
    );
  }

  public async failedTransaction(
    transactionId: string
  ): Promise<ITransaction | null> {
    return await this._transactionRepository.changePaymentStatus(
      transactionId,
      "failed"
    );
  }

  public async updateOnProcessPurchaseTransactions(): Promise<
    Array<ITransaction>
  > {
    return await this._transactionRepository.updateOnProcessPurchaseTransactions();
  }
}

export default TransactionService;
