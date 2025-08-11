import { Request, Response, NextFunction } from "express";
import binder from "../utils/binder";
import { IQuestionService } from "../interfaces/services/IQuestion.service";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { GeneralMessage, QuestionMessage } from "../constants/responseMessages";
import { addQuestionValidator } from "../validators/question.validator";

class QuestionController {
  constructor(private _questionService: IQuestionService) {
    binder(this);
  }

  public async getQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const { quizId } = req.params;

      const data = await this._questionService.getQuestions(quizId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  public async addQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { quizId } = req.params;
      const { answer, options, question } = addQuestionValidator(req.body);

      const data = await this._questionService.addQuestion(
        quizId,
        question,
        options,
        answer
      );

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(QuestionMessage.QuestionAdded, data));
    } catch (err) {
      next(err);
    }
  }

  public async editQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { questionId } = req.params;
      const { answer, options, question } = addQuestionValidator(req.body);

      const data = await this._questionService.editQuestion(
        questionId,
        question,
        options,
        answer
      );

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(QuestionMessage.QuestionUpdated, data));
    } catch (err) {
      next(err);
    }
  }

  public async deleteQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { questionId } = req.params;
      const data = await this._questionService.deleteQuestion(questionId);
      res
        .status(StatusCodes.OK)
        .json(successResponse(QuestionMessage.QuestionDeleted, data));
    } catch (err) {
      next(err);
    }
  }
}

export default QuestionController;
