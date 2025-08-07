import { Model } from "mongoose";
import { IQuizRepository } from "../interfaces/repositories/IQuiz.repository";
import { IQuiz } from "../models/Quiz.model";
import BaseRepository from "./Base.repository";

class QuizRepository extends BaseRepository<IQuiz> implements IQuizRepository {
  constructor(private _Quiz: Model<IQuiz>) {
    super(_Quiz);
  }

  public async getQuizByTitle(title: string): Promise<IQuiz | null> {
    return await this._Quiz.findOne({ title });
  }

  public async changeQuizListedStatus(
    quizId: string,
    isListed: boolean
  ): Promise<IQuiz | null> {
    return await this._Quiz.findByIdAndUpdate(quizId, { isListed });
  }

  public async getQuizListedStatus(quizId: string): Promise<IQuiz | null> {
    return await this._Quiz.findById(quizId);
  }

  public async getAdminQuizzesCount(search: RegExp): Promise<number> {
    return await this._Quiz.countDocuments(
      { title: search },
      { title: 1, isListed: 1, difficulty: 1 }
    );
  }

  public async getAdminQuizzes(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<IQuiz>> {
    return await this._Quiz.find({ title: search }).skip(skip).limit(limit);
  }
}

export default QuizRepository;
