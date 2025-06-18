import { Request, Response, NextFunction } from "express";
import { ITrainerService } from "../interfaces/services/ITrainer.service";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { GET_DATA_SUCCESS_MESSAGE } from "../constants/responseMessages";
import binder from "../utils/binder";
import { paginatedGetDataValidator } from "../validators/pagination.validator";

/** Trainer controller: manages trainer and student operations */
class TrainerController {
  /** Injects trainer service */
  constructor(private trainerService: ITrainerService) {
    binder(this);
  }

  /** Get all trainers */
  public async getAllTrainers(req: Request, res: Response, next: NextFunction) {
    try {
      const trainers = await this.trainerService.getAllTrainers();

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, trainers));
    } catch (err) {
      next(err);
    }
  }

  /** Get a single trainer by ID */
  public async getTrainer(req: Request, res: Response, next: NextFunction) {
    try {
      const { trainerId } = req.params;

      const trainer = await this.trainerService.getTrainer(trainerId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, trainer));
    } catch (err) {
      next(err);
    }
  }

  /** Get students with their enrolled courses for a trainer */
  public async getStudentsWithEnrolledCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const trainerId = req.userId!;
      const { page, search, size } = paginatedGetDataValidator(req.query);

      const data = await this.trainerService.getStudentsWithEnrolledCourses(
        trainerId,
        search,
        page,
        size
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }
}

export default TrainerController;
