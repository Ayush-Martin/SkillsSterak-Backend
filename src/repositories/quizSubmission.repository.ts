import { Model } from "mongoose";
import { IQuizSubmissionRepository } from "../interfaces/repositories/IQuizSubmission.repository";
import { IQuizSubmission } from "../models/QuizSubmission.model";
import BaseRepository from "./Base.repository";

class QuizSubmissionRepository
  extends BaseRepository<IQuizSubmission>
  implements IQuizSubmissionRepository
{
  constructor(private _QuizSubmission: Model<IQuizSubmission>) {
    super(_QuizSubmission);
  }

  public async getQuizSubmission(
    userId: string,
    quizId: string
  ): Promise<IQuizSubmission | null> {
    return await this._QuizSubmission.findOne({ userId, quizId });
  }
}

export default QuizSubmissionRepository;
