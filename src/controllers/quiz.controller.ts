import { Request, Response, NextFunction } from "express";
import { IQuizService } from "../interfaces/services/IQuiz.service";
import binder from "../utils/binder";
import {
  addQuizValidator,
  editQuizValidator,
  getUserQuizzesValidator,
} from "../validators/quiz.validator";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { GeneralMessage, QuizMessage } from "../constants/responseMessages";
import { paginatedGetDataValidator } from "../validators/pagination.validator";

class QuizController {
  constructor(private _quizService: IQuizService) {
    binder(this);
  }

  public async addQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, difficulty, topics } = addQuizValidator(
        req.body
      );

      const data = await this._quizService.addQuiz(
        title,
        description,
        difficulty,
        topics
      );

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(QuizMessage.QuizAdded, data));
    } catch (error) {
      next(error);
    }
  }

  public async listUnlistQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const { quizId } = req.params;

      const isListed = await this._quizService.listUnlistQuiz(quizId);

      res.status(StatusCodes.OK).json(
        successResponse(
          isListed ? QuizMessage.QuizListed : QuizMessage.QuizUnlisted,
          {
            quizId,
            isListed,
          }
        )
      );
    } catch (error) {
      next(error);
    }
  }

  public async editQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const { quizId } = req.params;
      const { description, difficulty, title, topics } = editQuizValidator(
        req.body
      );

      const data = await this._quizService.editQuiz(
        quizId,
        title,
        description,
        difficulty,
        topics
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(QuizMessage.QuizUpdated, data));
    } catch (error) {
      next(error);
    }
  }

  public async getAdminQuizzes(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { search, page, size } = paginatedGetDataValidator(req.query);

      const data = await this._quizService.getAdminQuizzes(search, page, size);
      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (error) {
      next(error);
    }
  }

  public async getAdminQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const { quizId } = req.params;
      const data = await this._quizService.getAdminQuiz(quizId);
      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (error) {
      next(error);
    }
  }

  public async getUserQuizzes(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, page, size, topics, difficulty } =
        getUserQuizzesValidator(req.query);
      const userId = req.userId!;
      console.log(topics);
      const data = await this._quizService.getUserQuizzes(
        userId,
        search,
        page,
        size,
        topics,
        difficulty
      );
      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (error) {
      next(error);
    }
  }

  public async getUserQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const { quizId } = req.params;

      const data = await this._quizService.getUserQuiz(quizId);
      
      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (error) {
      next(error);
    }
  }
}

export default QuizController;
