import { Request, Response, NextFunction } from "express";
import { ITrainerService } from "../interfaces/services/ITrainer.service";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import binder from "../utils/binder";
import { paginatedGetDataValidator } from "../validators/pagination.validator";
import { GeneralMessage } from "../constants/responseMessages";
import { IUserService } from "../interfaces/services/IUser.service";

/**
 * Handles trainer and student operations, including trainer listing and student analytics.
 * All methods are bound for safe Express routing.
 */
class TrainerController {
  constructor(
    private trainerService: ITrainerService,
    private userService: IUserService
  ) {
    // Ensures 'this' context is preserved for all methods
    binder(this);
  }

  /**
   * Retrieves all trainers for admin or user selection.
   */
  public async getAllTrainers(req: Request, res: Response, next: NextFunction) {
    try {
      const trainers = await this.trainerService.getAllTrainers();

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, trainers));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves a single trainer by ID for profile or detail views.
   */
  public async getTrainer(req: Request, res: Response, next: NextFunction) {
    try {
      const { trainerId } = req.params;

      const trainer = await this.userService.getUserProfileDetails(trainerId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, trainer));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Returns students with their enrolled courses for the authenticated trainer, supporting analytics and dashboard features.
   */
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
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Returns the total count of students for the authenticated trainer, supporting analytics and reporting.
   */
  public async getStudentsCount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const data = await this.trainerService.getStudentsCount(userId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }
}

export default TrainerController;
