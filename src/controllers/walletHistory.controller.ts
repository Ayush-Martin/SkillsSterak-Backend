import { Request, Response, NextFunction } from "express";
import { IWalletHistoryService } from "../interfaces/services/IWalletHistory.service";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { GeneralMessage } from "../constants/responseMessages";
import { pageValidator } from "../validators/pagination.validator";
import binder from "../utils/binder";

class WalletHistoryController {
  constructor(private _walletHistoryService: IWalletHistoryService) {
    binder(this);
  }

  public async getWalletHistory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.userId!;
      const { page, size } = pageValidator(req.query);

      const walletHistory = await this._walletHistoryService.getWalletHistory(
        userId,
        page,
        size
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, walletHistory));
    } catch (err) {
      next(err);
    }
  }
}

export default WalletHistoryController;
