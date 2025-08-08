import { Model } from "mongoose";
import { IQuestionRepository } from "../interfaces/repositories/IQuestion.repository";
import { IQuestion } from "../models/Question.model";
import BaseRepository from "./Base.repository";

class QuestionRepository
  extends BaseRepository<IQuestion>
  implements IQuestionRepository
{
  constructor(private _Question: Model<IQuestion>) {
    super(_Question);
  }

  public async getQuestions(quizId: string): Promise<IQuestion[]> {
    return await this._Question.find({ quizId });
  }
}

export default QuestionRepository;
