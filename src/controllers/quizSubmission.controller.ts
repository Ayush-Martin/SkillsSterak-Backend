import { resubmitQuizValidator } from "./../validators/quizSubmission.validator";
import { Request, Response, NextFunction } from "express";
import { IQuizSubmissionService } from "../interfaces/services/IQuizSubmission.service";
import binder from "../utils/binder";
import {
  GeneralMessage,
  QuizSubmissionMessage,
} from "../constants/responseMessages";
import { successResponse } from "../utils/responseCreators";
import { StatusCodes } from "../constants/statusCodes";
import { submitQuizValidator } from "../validators/quizSubmission.validator";
import { paginatedGetDataValidator } from "../validators/pagination.validator";

class QuizSubmissionController {
  constructor(private _quizSubmissionService: IQuizSubmissionService) {
    binder(this);
  }

  public async submitQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { quizId } = req.params;
      const { answers, timeTaken } = submitQuizValidator(req.body);
      const quizSubmission = await this._quizSubmissionService.submitQuiz(
        userId,
        quizId,
        answers,
        timeTaken
      );
      res
        .status(StatusCodes.CREATED)
        .json(
          successResponse(
            QuizSubmissionMessage.QuizSubmissionAdded,
            quizSubmission
          )
        );
    } catch (error) {
      next(error);
    }
  }

  public async resubmitQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { quizId, quizSubmissionId } = req.params;
      const { answers, timeTaken } = resubmitQuizValidator(req.body);
      const quizSubmission = await this._quizSubmissionService.resubmitQuiz(
        quizSubmissionId,
        userId,
        quizId,
        answers,
        timeTaken
      );
      res
        .status(StatusCodes.OK)
        .json(
          successResponse(
            QuizSubmissionMessage.QuizSubmissionUpdated,
            quizSubmission
          )
        );
    } catch (error) {
      next(error);
    }
  }

  public async getQuizSubmission(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const { quizId } = req.params;
      const quizSubmission =
        await this._quizSubmissionService.getQuizSubmission(userId, quizId);
      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, quizSubmission));
    } catch (error) {
      next(error);
    }
  }

  public async getUserQuizSubmissionsProgress(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const progress =
        await this._quizSubmissionService.getUserQuizSubmissionsProgress(
          userId
        );

      res.status(StatusCodes.OK).json(
        successResponse(
          GeneralMessage.DataReturned,
          progress || {
            quizzesTaken: 0,
            totalQuestions: 0,
            totalScore: 0,
          }
        )
      );
    } catch (error) {
      next(error);
    }
  }

  public async getAdminQuizSubmissions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { search, page, size } = paginatedGetDataValidator(req.query);
      const data = await this._quizSubmissionService.getAdminQuizSubmissions(
        search,
        page,
        size
      );
      console.log(data);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (error) {
      next(error);
    }
  }
}

export default QuizSubmissionController;
