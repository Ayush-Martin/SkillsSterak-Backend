import { Request, Response, NextFunction } from "express";
import { IWalletService } from "../interfaces/services/IWallet.service";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import binder from "../utils/binder";
import { GeneralMessage, WalletMessage } from "../constants/responseMessages";

/**
 * Handles user wallet information, Stripe account setup, and redemption actions.
 * All methods are bound for safe Express routing.
 */
class WalletController {
  constructor(private _walletService: IWalletService) {
    // Ensures 'this' context is preserved for all methods
    binder(this);
  }

  /**
   * Retrieves wallet information for the authenticated user, supporting balance and payout views.
   */
  public async getWalletInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;

      const data = await this._walletService.getUserWalletInfo(userId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Sets up a Stripe account for the user, enabling payouts and financial operations.
   */
  public async setUpStripeAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;

      const data = await this._walletService.setUpStripeUserAccount(userId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Redeems the user's wallet balance, supporting withdrawal or payout actions.
   */
  public async redeem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;

      await this._walletService.redeem(userId);

      res.status(StatusCodes.OK).json(successResponse(WalletMessage.Redeemed));
    } catch (err) {
      next(err);
    }
  }
}

export default WalletController;
