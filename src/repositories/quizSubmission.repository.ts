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

  public async getAdminQuizSubmissionsCount(search: RegExp): Promise<number> {
    const count = await this._QuizSubmission.aggregate([
      {
        $lookup: {
          from: "quizzes",
          localField: "quizId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                title: 1,
              },
            },
          ],
          as: "quizzes",
        },
      },
      {
        $match: {
          "quizzes.title": search,
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    return count[0]?.count || 0;
  }

  public async getAdminQuizSubmissions(
    skip: number,
    limit: number,
    search: RegExp
  ): Promise<IQuizSubmission[]> {
    return await this._QuizSubmission.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                email: 1,
              },
            },
          ],
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "quizzes",
          localField: "quizId",
          foreignField: "_id",
          pipeline: [
            {
              $lookup: {
                from: "questions",
                localField: "_id",
                foreignField: "quizId",
                pipeline: [
                  {
                    $project: {
                      question: 1,
                      options: 1,
                      answer: 1,
                    },
                  },
                ],
                as: "questions",
              },
            },
            {
              $project: {
                title: 1,
                difficulty: 1,
                questions: 1,
              },
            },
          ],
          as: "quiz",
        },
      },
      {
        $unwind: "$quiz",
      },
      {
        $match: {
          "quiz.title": search,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          score: 1,
          timeTaken: 1,
          answers: 1,
          user: 1,
          quiz: 1,
          createdAt: 1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
  }
}

export default QuizSubmissionRepository;
