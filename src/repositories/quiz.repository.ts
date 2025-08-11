import mongoose, { Model } from "mongoose";
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

  public async getUserQuizzesCount(
    search: RegExp,
    filter: Record<string, any>
  ): Promise<number> {
    return await this._Quiz.countDocuments({
      title: search,
      ...filter,
      isListed: 1,
    });
  }

  public async getUserQuizzes(
    userId: string,
    search: RegExp,
    skip: number,
    limit: number,
    filter: Record<string, any>
  ): Promise<Array<IQuiz>> {
    return await this._Quiz.aggregate([
      {
        $match: {
          isListed: true,
          title: search,
          ...filter,
        },
      },
      {
        $lookup: {
          from: "quizsubmissions",
          let: { quizId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$quizId", "$$quizId"],
                },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                userSubmission: {
                  $max: {
                    $cond: [
                      {
                        $eq: ["$userId", new mongoose.Types.ObjectId(userId)],
                      },
                      true,
                      false,
                    ],
                  },
                },
              },
            },
          ],
          as: "quizSubmissions",
        },
      },
      {
        $unwind: {
          path: "$quizSubmissions",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          difficulty: 1,
          topics: 1,
          totalSubmissions: { $ifNull: ["$quizSubmissions.count", 0] },
          userSubmitted: {
            $ifNull: ["$quizSubmissions.userSubmission", false],
          },
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

  public async getUserQuiz(quizId: string): Promise<IQuiz | null> {
    const quiz = await this._Quiz.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(quizId),
        },
      },
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "quizId",
          as: "questions",
        },
      },
      {
        $lookup: {
          from: "topics",
          localField: "topics",
          foreignField: "_id",
          as: "topics",
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          difficulty: 1,
          topics: { topicName: 1, _id: 1 },
          questions: {
            _id: 1,
            question: 1,
            options: { choice: 1, id: 1 },
            answer: 1,
          },
        },
      },
    ]);

    return quiz[0];
  }
}

export default QuizRepository;
