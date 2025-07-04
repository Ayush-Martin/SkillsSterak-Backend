import { Request, Response, NextFunction } from "express";
import { ISubscriptionService } from "../interfaces/services/ISubscription.service";
import { successResponse } from "../utils/responseCreators";
import {
  GET_DATA_SUCCESS_MESSAGE,
  SUBSCRIPTION_ADDED_SUCCESS_MESSAGE,
} from "../constants/responseMessages";
import { StatusCodes } from "../constants/statusCodes";
import binder from "../utils/binder";

/** Subscription controller: manages user subscriptions */
class SubscriptionController {
  /** Injects subscription service */
  constructor(private subscriptionService: ISubscriptionService) {
    binder(this);
  }

  /** Create a new subscription order */
  public async createSubscriptionOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log("subscription ");
      const userId = req.userId!;
      const order = await this.subscriptionService.createSubscriptionOrder(
        userId
      );
      res.status(200).json(successResponse(GET_DATA_SUCCESS_MESSAGE, order));
    } catch (err) {
      next(err);
    }
  }

  /** Complete a subscription payment */
  // public async completeSubscription(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { orderId } = req.body;
  //     await this.subscriptionService.completeSubscription(orderId);
  //     res
  //       .status(StatusCodes.OK)
  //       .json(successResponse(SUBSCRIPTION_ADDED_SUCCESS_MESSAGE));
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  /** Get subscription details for a user */
  public async getSubscriptionDetail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;

      const subscription = await this.subscriptionService.getSubscriptionDetail(
        userId
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, subscription));
    } catch (err) {
      next(err);
    }
  }
}

export default SubscriptionController;
