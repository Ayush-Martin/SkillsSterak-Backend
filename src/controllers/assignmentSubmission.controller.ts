import { Request, Response, NextFunction } from "express";
import { IAssignmentSubmissionService } from "../interfaces/services/IAssignmentSubmission.service";
import binder from "../utils/binder";
import {
  changeAssignmentSubmissionStatusValidator,
  submitAssignmentValidator,
} from "../validators/assignment.validator";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import {
  AssignmentMessage,
  GeneralMessage,
} from "../constants/responseMessages";
import {
  pageValidator,
  paginatedGetDataValidator,
} from "../validators/pagination.validator";

class AssignmentSubmissionController {
  constructor(
    private _assignmentSubmissionService: IAssignmentSubmissionService
  ) {
    binder(this);
  }

  public async submitAssignment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const file = req.file;
      const { assignmentId ,courseId} = req.params;
      const { type, content } = submitAssignmentValidator(req.body);

      const data = await this._assignmentSubmissionService.submitAssignment(
        userId,
        courseId,
        assignmentId,
        type,
        content,
        file?.path
      );

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(AssignmentMessage.AssignmentSubmitted, data));
    } catch (err) {
      next(err);
    }
  }

  public async getAssignmentSubmissions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const { page, size } = pageValidator(req.query);
      const data =
        await this._assignmentSubmissionService.getTrainerAssignmentSubmissions(
          userId,
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

  public async changeAssignmentSubmissionStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { assignmentSubmissionId } = req.params;
      const { status } = changeAssignmentSubmissionStatusValidator(req.query);
      const data =
        await this._assignmentSubmissionService.changeSubmissionStatus(
          assignmentSubmissionId,
          status
        );
      res
        .status(StatusCodes.OK)
        .json(
          successResponse(
            status == "verified"
              ? AssignmentMessage.AssignmentGraded
              : AssignmentMessage.AssignmentUngraded,
            data
          )
        );
    } catch (err) {
      next(err);
    }
  }

  public async resubmitAssignment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { assignmentSubmissionId } = req.query as {
        assignmentSubmissionId: string;
      };
      const file = req.file;
      const { type, content } = submitAssignmentValidator(req.body);

      const data = await this._assignmentSubmissionService.resubmitAssignment(
        assignmentSubmissionId,
        type,
        content,
        file?.path
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(AssignmentMessage.AssignmentReSubmitted, data));
    } catch (err) {
      next(err);
    }
  }
}

export default AssignmentSubmissionController;
