import mongoose, { Model } from "mongoose";
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

  public async getUserQuizSubmissionsProgress(
    userId: string
  ): Promise<IQuizSubmission | null> {
    const progress = await this._QuizSubmission.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: 0,
          quizzesTaken: { $sum: 1 },
          totalQuestions: {
            $sum: { $size: "$answers" },
          },
          totalScore: { $sum: "$score" },
        },
      },
    ]);

    return progress.length > 0 ? progress[0] : null;
  }
}

export default QuizSubmissionRepository;
