import { Request, Response, NextFunction } from "express";
import { IAssignmentService } from "../interfaces/services/IAssignment.service";
import {
  createAssignmentValidator,
  editAssignmentValidator,
} from "../validators/assignment.validator";
import { StatusCodes } from "../constants/statusCodes";
import {
  AssignmentMessage,
  GeneralMessage,
} from "../constants/responseMessages";
import { successResponse } from "../utils/responseCreators";
import binder from "../utils/binder";

class AssignmentController {
  constructor(private _assignmentService: IAssignmentService) {
    binder(this);
  }

  public async createAssignment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const { title, description, task } = createAssignmentValidator(req.body);

      const data = await this._assignmentService.createAssignment(
        title,
        description,
        task,
        courseId
      );

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(AssignmentMessage.AssignmentAdded, data));
    } catch (err) {
      next(err);
    }
  }

  public async editAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const { assignmentId } = req.params;
      const { title, description, task } = editAssignmentValidator(req.body);

      const data = await this._assignmentService.editAssignment(
        assignmentId,
        title,
        description,
        task
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(AssignmentMessage.AssignmentUpdated, data));
    } catch (err) {
      next(err);
    }
  }

  public async deleteAssignment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { assignmentId } = req.params;

      await this._assignmentService.deleteAssignment(assignmentId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(AssignmentMessage.AssignmentDeleted));
    } catch (err) {
      next(err);
    }
  }

  public async getAssignments(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;

      const data = await this._assignmentService.getCourseAssignments(courseId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  public async getUserAssignments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const { courseId } = req.params;

      const data = await this._assignmentService.getUserAssignments(
        userId,
        courseId
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }
}

export default AssignmentController;
