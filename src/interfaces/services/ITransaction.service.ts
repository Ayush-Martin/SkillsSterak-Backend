import { Buffer } from "exceljs";
import { ITransaction } from "../../models/Transaction.model";
import { IFilterType } from "../../types/revenueType";

export interface ITransactionService {
  /**
   * Returns a paginated list of transactions for a user. Used for user dashboards, purchase history, and receipts.
   */
  getUserTransactions(
    userId: string,
    page: number,
    size: number
  ): Promise<{
    transactions: Array<ITransaction>;
    currentPage: number;
    totalPages: number;
  }>;

  /**
   * Returns a paginated list of all transactions in the system. Used for admin financial oversight and reporting.
   */
  getTransactions(
    page: number,
    size: number
  ): Promise<{
    transactions: Array<ITransaction>;
    currentPage: number;
    totalPages: number;
  }>;

  /**
   * Returns paginated revenue data for the admin, filtered by type and date range. Used for analytics and financial reporting.
   */
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

  /**
   * Returns paginated revenue data for a trainer, filtered by type and date range. Used for trainer analytics and earnings tracking.
   */
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

  /**
   * Exports admin revenue data as a PDF or Excel file. Used for financial records, audits, and sharing reports.
   */
  exportAdminRevenue(
    filterType: IFilterType,
    startDate: string,
    endDate: string,
    exportType: "pdf" | "excel"
  ): Promise<PDFKit.PDFDocument | Buffer>;

  /**
   * Exports trainer revenue data as a PDF or Excel file. Used for trainer records, tax purposes, and analytics.
   */
  exportTrainerRevenue(
    trainerId: string,
    filterType: IFilterType,
    startDate: string,
    endDate: string,
    exportType: "pdf" | "excel"
  ): Promise<PDFKit.PDFDocument | Buffer>;

  /**
   * Returns revenue data for admin in a format suitable for graphing. Used for dashboard visualizations and trend analysis.
   */
  getAdminRevenueGraphData(): Promise<ITransaction>;

  /**
   * Returns revenue data for a trainer in a format suitable for graphing. Used for trainer dashboards and performance tracking.
   */
  getTrainerRevenueGraphData(trainerId: string): Promise<ITransaction>;
}
