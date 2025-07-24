import { Request, Response, NextFunction } from "express";
import { ISubscriptionPlanService } from "../interfaces/services/ISubscriptionPlan.service";
import { paginatedGetDataValidator } from "../validators/pagination.validator";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import {
  GeneralMessage,
  SubscriptionPlanMessage,
} from "../constants/responseMessages";
import {
  createSubscriptionPlanIdValidator,
  editSubscriptionPlanIdValidator,
} from "../validators/subscriptionPlan.validator";
import binder from "../utils/binder";

class SubscriptionPlanController {
  constructor(private _subscriptionPlanService: ISubscriptionPlanService) {
    binder(this);
  }

  public async getSubscriptionPlans(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, search, size } = paginatedGetDataValidator(req.query);

      const data = await this._subscriptionPlanService.getSubscriptionPlans(
        search,
        page,
        size
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  public async getAllSubscriptionPlans(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        await this._subscriptionPlanService.getAllSubscriptionPlans();

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  public async createSubscriptionPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { description, duration, price, title } =
        createSubscriptionPlanIdValidator(req.body);

      const data = await this._subscriptionPlanService.createSubscriptionPlan(
        title,
        description,
        price,
        duration
      );

      res
        .status(StatusCodes.CREATED)
        .json(
          successResponse(SubscriptionPlanMessage.SubscriptionPlanAdded, data)
        );
    } catch (err) {
      next(err);
    }
  }

  public async editSubscriptionPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { subscriptionPlanId } = req.params;
      const { description, duration, price, title } =
        editSubscriptionPlanIdValidator(req.body);

      const data = await this._subscriptionPlanService.editSubscriptionPlan(
        subscriptionPlanId,
        title,
        description,
        price,
        duration
      );

      res
        .status(StatusCodes.OK)
        .json(
          successResponse(SubscriptionPlanMessage.SubscriptionPlanUpdated, data)
        );
    } catch (err) {
      next(err);
    }
  }

  public async listUnlistSubscriptionPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { subscriptionPlanId } = req.params;

      const isListed =
        await this._subscriptionPlanService.changeSubscriptionPlanListingStatus(
          subscriptionPlanId
        );

      res
        .status(StatusCodes.OK)
        .json(
          successResponse(
            isListed
              ? SubscriptionPlanMessage.SubscriptionListed
              : SubscriptionPlanMessage.SubscriptionUnlisted,
            { subscriptionPlanId, isListed }
          )
        );
    } catch (err) {
      next(err);
    }
  }
}

export default SubscriptionPlanController;
