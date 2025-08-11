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
        await this._quizSubmissionService.getQuizSubmission(
          userId,
          quizId
        );
      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, quizSubmission));
    } catch (error) {
      next(error);
    }
  }
}

export default QuizSubmissionController;
