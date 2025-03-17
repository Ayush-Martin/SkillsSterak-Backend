import { Request, Response, NextFunction } from "express";
import { ITrainerService } from "../interfaces/services/ITrainer.service";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { approveRejectRequestValidator } from "../validators/trainerRequest.validator";
import {
  GET_DATA_SUCCESS_MESSAGE,
  TRAINER_REQUEST_APPROVED_SUCCESS_MESSAGE,
  TRAINER_REQUEST_REJECTED_SUCCESS_MESSAGE,
} from "../constants/responseMessages";
import binder from "../utils/binder";
import { pageValidator } from "../validators/index.validator";

class TrainerRequestController {
  constructor(private trainerService: ITrainerService) {
    binder(this);
  }

  public async getTrainerRequests(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page } = pageValidator(req.query);

      const { users, currentPage, totalPages } =
        await this.trainerService.getTrainerRequest(page);

      res.status(StatusCodes.OK).json(
        successResponse(GET_DATA_SUCCESS_MESSAGE, {
          users,
          currentPage,
          totalPages,
        })
      );
    } catch (err) {
      next(err);
    }
  }

  public async approveRejectRequests(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { status } = approveRejectRequestValidator(req.query);

    const { userId } = req.params;

    await this.trainerService.approveRejectTrainerRequest(userId, status);

    res
      .status(StatusCodes.OK)
      .json(
        successResponse(
          status == "approved"
            ? TRAINER_REQUEST_APPROVED_SUCCESS_MESSAGE
            : TRAINER_REQUEST_REJECTED_SUCCESS_MESSAGE,
          { userId, status }
        )
      );
  }
}

export default TrainerRequestController;
