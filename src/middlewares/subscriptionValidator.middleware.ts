import { Request, Response, NextFunction } from "express";
import SubscriptionModel from "../models/Subscription.model";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../constants/statusCodes";
import { SubscriptionMessage } from "../constants/responseMessages";

/**
 * Ensures that only users with an active subscription can access protected routes.
 * - Checks for a valid subscription record for the current user.
 * - Blocks access if the user is not subscribed or if the subscription has expired.
 * - Forwards errors to the error handler for consistent API responses.
 */
export const subscriptionValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Retrieve user ID from request (set by authentication middleware)
    const userId = req.userId!;

    // Look up the user's subscription in the database
    const userSubscription = await SubscriptionModel.findOne({ userId });

    // Block access if the user does not have a subscription
    if (!userSubscription) {
      return errorCreator(
        SubscriptionMessage.NotSubscribed,
        StatusCodes.FORBIDDEN
      );
    }

    // Block access if the subscription has expired
    if (Date.now() > userSubscription.endDate.getTime()) {
      return errorCreator(
        SubscriptionMessage.SubscriptionExpired,
        StatusCodes.FORBIDDEN
      );
    }

    // Allow access if subscription is valid
    next();
  } catch (err) {
    // Forward errors to the error handler middleware
    next(err);
  }
};
