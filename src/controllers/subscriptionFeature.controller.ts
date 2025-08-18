import { Request, Response, NextFunction } from "express";
import { ISubscriptionFeatureService } from "../interfaces/services/ISubscriptionFeature.service";
import binder from "../utils/binder";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { GeneralMessage } from "../constants/responseMessages";

class SubscriptionFeatureController {
  constructor(
    private _subscriptionFeatureService: ISubscriptionFeatureService
  ) {
    binder(this);
  }

  public async getAllSubscriptionFeatures(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const features =
        await this._subscriptionFeatureService.getAllSubscriptionFeatures();
        
      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, features));
    } catch (err) {
      next(err);
    }
  }
}

export default SubscriptionFeatureController;
