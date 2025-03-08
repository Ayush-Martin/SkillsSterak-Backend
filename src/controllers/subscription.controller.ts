import { Request, Response, NextFunction } from "express";
import { ISubscriptionService } from "../interfaces/services/ISubscription.service";
import { successResponse } from "../utils/responseCreators";
import { GET_DATA_SUCCESS_MESSAGE } from "../constants/responseMessages";
import { StatusCodes } from "../utils/statusCodes";

class SubscriptionController {
  constructor(private subscriptionService: ISubscriptionService) {}

  public async createSubscriptionOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const order = await this.subscriptionService.createSubscriptionOrder(
        userId
      );
      res.status(200).json(successResponse(GET_DATA_SUCCESS_MESSAGE, order));
    } catch (err) {
      next(err);
    }
  }

  public async completeSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { orderId } = req.body;
      console.log(orderId, req.body);
      await this.subscriptionService.completeSubscription(orderId);
      res
        .status(StatusCodes.OK)
        .json(successResponse("Subscription completed successfully"));
    } catch (error) {
      next(error);
    }
  }
}

export default SubscriptionController;
