import { Request, Response, NextFunction } from "express";
import { ITrainerService } from "../interfaces/services/ITrainer.service";
import { StatusCodes } from "../utils/statusCodes";
import { successResponse } from "../utils/responseCreators";
import {
  approveRejectRequestValidator,
  getTrainerRequestValidator,
} from "../validators/trainerRequest.validator";
import { GET_DATA_SUCCESS_MESSAGE } from "../constants/responseMessages";

class TrainerRequestController {
  constructor(private trainerService: ITrainerService) {}

  public async getTrainerRequests(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page } = getTrainerRequestValidator(req.query);

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
      .json(successResponse(`Request has been ${status}`, { userId, status }));
  }
}

export default TrainerRequestController;
