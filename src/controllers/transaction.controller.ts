import { Request, Response, NextFunction } from "express";
import { ITransactionService } from "../interfaces/services/ITransaction.service";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { GET_DATA_SUCCESS_MESSAGE } from "../constants/responseMessages";
import { pageValidator } from "../validators/pagination.validator";
import binder from "../utils/binder";

class TransactionController {
  constructor(private transactionService: ITransactionService) {
    binder(this);
  }

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
}

export default TransactionController;
