import { Request, Response, NextFunction } from "express";
import { ITransactionService } from "../interfaces/services/ITransaction.service";
import { StatusCodes } from "../utils/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { GET_DATA_SUCCESS_MESSAGE } from "../constants/responseMessages";
import { pageValidator } from "../validators/index.validator";

class TransactionController {
  constructor(private transactionService: ITransactionService) {}

  public async getUserTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const { page } = pageValidator(req.query);

      const data = await this.transactionService.getUserTransactions(
        userId,
        page
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
      const { page } = pageValidator(req.query);

      const data = await this.transactionService.getTransactions(page);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }
}

export default TransactionController;
