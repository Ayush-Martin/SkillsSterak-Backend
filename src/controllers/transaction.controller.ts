import { Request, Response, NextFunction } from "express";
import { ITransactionService } from "../interfaces/services/ITransaction.service";
import { StatusCodes } from "../utils/statusCodes";
import { successResponse } from "../utils/responseCreators";

class TransactionController {
  constructor(private transactionService: ITransactionService) {}

  public async getUserTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const page = parseInt(req.query.page as string) || 1;

      const data = await this.transactionService.getUserTransactions(
        userId,
        page
      );

      res.status(StatusCodes.OK).json(successResponse("Data", data));
    } catch (err) {
      next(err);
    }
  }

  public async getTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const page = parseInt(req.query.page as string) || 1;

      const data = await this.transactionService.getTransactions(page);

      res.status(StatusCodes.OK).json(successResponse("Data", data));
    } catch (err) {
      next(err);
    }
  }
}

export default TransactionController;
