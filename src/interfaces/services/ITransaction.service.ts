import { Buffer } from "exceljs";
import { ITransaction } from "../../models/Transaction.model";
import { IFilterType } from "../../types/revenueType";

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

  getAdminRevenue(
    page: number,
    size: number,
    filterType: IFilterType,
    startDate: string,
    endDate: string
  ): Promise<{
    revenue: ITransaction;
    currentPage: number;
    totalPages: number;
  }>;

  getTrainerRevenue(
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
  }>;

  exportAdminRevenue(
    filterType: IFilterType,
    startDate: string,
    endDate: string,
    exportType: "pdf" | "excel"
  ): Promise<PDFKit.PDFDocument | Buffer>;

  exportTrainerRevenue(
    trainerId: string,
    filterType: IFilterType,
    startDate: string,
    endDate: string,
    exportType: "pdf" | "excel"
  ): Promise<PDFKit.PDFDocument | Buffer>;

  getAdminRevenueGraphData(): Promise<ITransaction>;
  getTrainerRevenueGraphData(trainerId: string): Promise<ITransaction>;
}
