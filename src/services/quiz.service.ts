import { ObjectId } from "mongoose";
import { IQuizRepository } from "../interfaces/repositories/IQuiz.repository";
import { IQuizService } from "../interfaces/services/IQuiz.service";
import { IQuiz } from "../models/Quiz.model";
import errorCreator from "../utils/customError";
import { QuizMessage } from "../constants/responseMessages";
import { StatusCodes } from "../constants/statusCodes";

class QuizService implements IQuizService {
  constructor(private _quizRepository: IQuizRepository) {}

  public async addQuiz(
    title: string,
    description: string,
    difficulty: "beginner" | "intermediate" | "advance",
    topics: Array<ObjectId>
  ): Promise<IQuiz> {
    const existingQuiz = await this._quizRepository.getQuizByTitle(title);

    if (existingQuiz)
      errorCreator(QuizMessage.QuizExists, StatusCodes.CONFLICT);

    return this._quizRepository.create({
      title,
      description,
      difficulty,
      topics,
      isListed: true,
    });
  }

  public async listUnlistQuiz(quizId: string): Promise<boolean> {
    const quiz = await this._quizRepository.getQuizListedStatus(quizId);
    if (!quiz) {
      errorCreator(QuizMessage.QuizNotFound, StatusCodes.NOT_FOUND);
      return false;
    }
    await this._quizRepository.changeQuizListedStatus(quizId, !quiz.isListed);

    return !quiz.isListed;
  }

  public async editQuiz(
    quizId: string,
    title: string,
    description: string,
    difficulty: "beginner" | "intermediate" | "advance",
    topics: Array<ObjectId>
  ): Promise<IQuiz | null> {
    return await this._quizRepository.updateById(quizId, {
      title,
      description,
      difficulty,
      topics,
    });
  }

  public async getAdminQuizzes(
    search: string,
    page: number,
    size: number
  ): Promise<{
    quizzes: Array<IQuiz>;
    currentPage: number;
    totalPages: number;
  }> {
    const searchRegex = new RegExp(search, "i");
    const skip = (page - 1) * size;
    const quizzes = await this._quizRepository.getAdminQuizzes(
      searchRegex,
      skip,
      size
    );

    const totalQuizzes = await this._quizRepository.getAdminQuizzesCount(
      searchRegex
    );
    const totalPages = Math.ceil(totalQuizzes / size);
    return {
      quizzes,
      currentPage: page,
      totalPages,
    };
  }

  public async getAdminQuiz(quizId: string): Promise<IQuiz | null> {
    return await this._quizRepository.findById(quizId);
  }
}

export default QuizService;
