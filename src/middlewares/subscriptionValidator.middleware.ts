import { Request, Response, NextFunction } from "express";
import SubscriptionModel from "../models/Subscription.model";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../utils/statusCodes";

export const subscriptionValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;

    const userSubscription = await SubscriptionModel.findOne({ userId });

    if (!userSubscription) {
      return errorCreator("you are not subscribed", StatusCodes.FORBIDDEN);
    }

    if (Date.now() > userSubscription.endDate.getTime()) {
      return errorCreator("subscription expired", StatusCodes.FORBIDDEN);
    }

    next();
  } catch (err) {
    next(err);
  }
};
