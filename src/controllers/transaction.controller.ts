import { StatusCodes } from "./../constants/statusCodes";
import { Request, Response, NextFunction } from "express";
import { ITransactionService } from "../interfaces/services/ITransaction.service";
import { successResponse } from "../utils/responseCreators";
import { GET_DATA_SUCCESS_MESSAGE } from "../constants/responseMessages";
import { pageValidator } from "../validators/pagination.validator";
import binder from "../utils/binder";
import { IFilterType } from "../types/revenueType";
import { Buffer } from "exceljs";

/** Transaction controller: manages user and admin transactions */
class TransactionController {
  /** Injects transaction service */
  constructor(private transactionService: ITransactionService) {
    binder(this);
  }

  /** Get all transactions for a user */
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
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }

  /** Get all transactions (admin) */
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
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }

  public async getAdminRevenue(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, size } = pageValidator(req.query);
      const { filterType, startDate, endDate } = req.query as {
        filterType: IFilterType;
        startDate: string;
        endDate: string;
      };

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
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }

  public async getTrainerRevenue(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const { page, size } = pageValidator(req.query);
      const { filterType, startDate, endDate } = req.query as {
        filterType: IFilterType;
        startDate: string;
        endDate: string;
      };

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
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }

  public async exportAdminRevenue(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { filterType, startDate, endDate, exportType } = req.query as {
        filterType: IFilterType;
        startDate: string;
        endDate: string;
        exportType: "pdf" | "excel";
      };

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

  public async exportTrainerRevenue(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const { filterType, startDate, endDate, exportType } = req.query as {
        filterType: IFilterType;
        startDate: string;
        endDate: string;
        exportType: "pdf" | "excel";
      };

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

  public async getAdminRevenueGraphData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await this.transactionService.getAdminRevenueGraphData();

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }

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
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }
}

export default TransactionController;
