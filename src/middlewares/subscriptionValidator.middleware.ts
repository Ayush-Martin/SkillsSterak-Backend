import { Request, Response, NextFunction } from "express";
import SubscriptionModel from "../models/Subscription.model";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../utils/statusCodes";
import {
  SUBSCRIPTION_EXPIRED_ERROR_MESSAGE,
  USER_NOT_SUBSCRIBED_ERROR_MESSAGE,
} from "../constants/responseMessages";

/**
 * Subscription Validator Middleware
 * This middleware is responsible for verifying if a user has an active subscription
 * before allowing them to access certain routes.
 */
export const subscriptionValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;

    const userSubscription = await SubscriptionModel.findOne({ userId });

    if (!userSubscription) {
      return errorCreator(
        USER_NOT_SUBSCRIBED_ERROR_MESSAGE,
        StatusCodes.FORBIDDEN
      );
    }

    if (Date.now() > userSubscription.endDate.getTime()) {
      return errorCreator(
        SUBSCRIPTION_EXPIRED_ERROR_MESSAGE,
        StatusCodes.FORBIDDEN
      );
    }

    next();
  } catch (err) {
    next(err);
  }
};
