import { StatusCodes } from "./../constants/statusCodes";
import { Request, Response, NextFunction } from "express";
import { ITransactionService } from "../interfaces/services/ITransaction.service";
import { successResponse } from "../utils/responseCreators";
import { pageValidator } from "../validators/pagination.validator";
import binder from "../utils/binder";
import { Buffer } from "exceljs";
import { GeneralMessage } from "../constants/responseMessages";
import {
  exportAdminRevenueValidator,
  exportTrainerRevenueValidator,
  getAdminRevenueValidator,
  getTrainerRevenueValidator,
} from "../validators/transaction.validator";

/**
 * Handles user and admin transaction queries, revenue exports, and analytics.
 * All methods are bound for safe Express routing.
 */
class TransactionController {
  constructor(private transactionService: ITransactionService) {
    // Ensures 'this' context is preserved for all methods
    binder(this);
  }

  /**
   * Returns all transactions for the authenticated user, paginated.
   */
  public async getUserTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const { page, size } = pageValidator(req.query);

      const data = await this.transactionService.getUserTransactions(
        userId,
        page,
        size
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Returns all transactions for admin, paginated.
   */
  public async getTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, size } = pageValidator(req.query);

      const data = await this.transactionService.getTransactions(page, size);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Returns admin revenue data with filters for analytics and reporting.
   */
  public async getAdminRevenue(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, size, filterType, startDate, endDate } =
        getAdminRevenueValidator(req.query);

      const data = await this.transactionService.getAdminRevenue(
        page,
        size,
        filterType,
        startDate,
        endDate
      );

      console.log(data);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Returns trainer revenue data with filters for analytics and reporting.
   */
  public async getTrainerRevenue(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const { page, size, filterType, startDate, endDate } =
        getTrainerRevenueValidator(req.query);

      const data = await this.transactionService.getTrainerRevenue(
        userId,
        page,
        size,
        filterType,
        startDate,
        endDate
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Exports admin revenue data as PDF or Excel, supporting financial reporting.
   */
  public async exportAdminRevenue(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { filterType, startDate, endDate, exportType } =
        exportAdminRevenueValidator(req.query);

      const exportData = await this.transactionService.exportAdminRevenue(
        filterType,
        startDate,
        endDate,
        exportType
      );

      console.log(exportType, exportData);

      if (exportType === "pdf") {
        const pdf = exportData as PDFKit.PDFDocument;
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=admin-revenue-report.pdf"
        );
        res.status(StatusCodes.OK);
        pdf.pipe(res);
        pdf.end();
      } else {
        const excel = exportData as Buffer;
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=admin-revenue-report.xlsx"
        );
        res.send(excel);
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * Exports trainer revenue data as PDF or Excel, supporting financial reporting for trainers.
   */
  public async exportTrainerRevenue(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const { filterType, startDate, endDate, exportType } =
        exportTrainerRevenueValidator(req.query);

      const exportData = await this.transactionService.exportTrainerRevenue(
        userId,
        filterType,
        startDate,
        endDate,
        exportType
      );

      if (exportType === "pdf") {
        const pdf = exportData as PDFKit.PDFDocument;
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=admin-revenue-report.pdf"
        );
        res.status(StatusCodes.OK);
        pdf.pipe(res);
        pdf.end();
      } else {
        const excel = exportData as Buffer;
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=admin-revenue-report.xlsx"
        );
        res.send(excel);
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * Returns admin revenue graph data for dashboard visualizations.
   */
  public async getAdminRevenueGraphData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await this.transactionService.getAdminRevenueGraphData();

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Returns trainer revenue graph data for dashboard visualizations.
   */
  public async getTrainerRevenueGraphData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const data = await this.transactionService.getTrainerRevenueGraphData(
        userId
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }
}

export default TransactionController;
