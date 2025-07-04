import { Request, Response, NextFunction } from "express";
import { IWalletService } from "../interfaces/services/IWallet.service";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { GET_DATA_SUCCESS_MESSAGE } from "../constants/responseMessages";
import binder from "../utils/binder";

/** Wallet controller: manages user wallet info */
class WalletController {
  /** Injects wallet service */
  constructor(private walletService: IWalletService) {
    binder(this);
  }

  /** Get wallet info for a user */
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

  public async setUpStripeAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;

      const data = await this.walletService.setUpStripeUserAccount(userId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }

  public async redeem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;

      const data = await this.walletService.redeem(userId);

      res
        .status(StatusCodes.OK)
        .json(successResponse("amount has been redeemed"));
    } catch (err) {
      next(err);
    }
  }
}

export default WalletController;
