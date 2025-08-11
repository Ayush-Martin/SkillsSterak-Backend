import { Request, Response, NextFunction } from "express";
import { subscriptionService } from "../dependencyInjector";
import { ISubscriptionFeatureId } from "../constants/general";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../constants/statusCodes";
import { isBefore, isAfter } from "date-fns";

export const checkUserSubscribed = (feature: ISubscriptionFeatureId) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;

      const subscriptionDetail =
        await subscriptionService.getSubscriptionDetail(userId);

      if (!subscriptionDetail) {
        errorCreator(
          "You must subscribe to access this feature",
          StatusCodes.FORBIDDEN
        );
        return;
      }

      const active =
        subscriptionDetail.startDate &&
        subscriptionDetail.endDate &&
        isBefore(subscriptionDetail.startDate, new Date()) &&
        isAfter(subscriptionDetail.endDate, new Date());

      if (!active) {
        errorCreator(
          "You must subscribe to access this feature",
          StatusCodes.FORBIDDEN
        );
        return;
      }

      if (!subscriptionDetail.features.includes(feature)) {
        errorCreator(
          "You must subscribe with the appropriate plan to access this feature",
          StatusCodes.FORBIDDEN
        );
        return;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
