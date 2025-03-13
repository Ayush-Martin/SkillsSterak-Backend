import { Request, Response, NextFunction } from "express";
import { IWalletService } from "../interfaces/services/IWallet.service";
import { StatusCodes } from "../utils/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { GET_DATA_SUCCESS_MESSAGE } from "../constants/responseMessages";
import binder from "../utils/binder";

class WalletController {
  constructor(private walletService: IWalletService) {
    binder(this);
  }

  public async getWalletInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;

      const data = await this.walletService.getUserWalletInfo(userId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }
}

export default WalletController;
