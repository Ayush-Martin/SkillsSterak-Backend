import { Request, Response, NextFunction } from "express";
import { ISubscriptionService } from "../interfaces/services/ISubscription.service";
import { successResponse } from "../utils/responseCreators";
import { StatusCodes } from "../constants/statusCodes";
import binder from "../utils/binder";
import { GeneralMessage } from "../constants/responseMessages";
import { getSubscribedUsersValidator } from "../validators/subscription.validator";

/**
 * Handles user subscription creation and retrieval.
 * All methods are bound for safe Express routing.
 */
class SubscriptionController {
  constructor(private _subscriptionService: ISubscriptionService) {
    // Ensures 'this' context is preserved for all methods
    binder(this);
  }

  /**
   * Creates a new subscription order for the authenticated user.
   * Used to initiate the subscription payment process.
   */
  public async createSubscriptionOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const { subscriptionPlanId } = req.params;
      const order = await this._subscriptionService.createSubscriptionOrder(
        userId,
        subscriptionPlanId
      );
      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, order));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves the current subscription details for the authenticated user.
   * Supports subscription status display and access control.
   */
  public async getSubscriptionDetail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;

      const subscription =
        await this._subscriptionService.getSubscriptionDetail(userId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, subscription));
    } catch (err) {
      next(err);
    }
  }

  public async getSubscribedUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { search, page, size, subscriptionPlanId } =
        getSubscribedUsersValidator(req.query);

      const data = await this._subscriptionService.getSubscribedUsers(
        search,
        page,
        size,
        subscriptionPlanId
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }
}

export default SubscriptionController;
