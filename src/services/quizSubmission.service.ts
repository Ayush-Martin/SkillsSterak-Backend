import { ObjectId } from "mongoose";
import { IQuizSubmissionRepository } from "../interfaces/repositories/IQuizSubmission.repository";
import { IQuizSubmissionService } from "../interfaces/services/IQuizSubmission.service";
import { IQuizSubmission } from "../models/QuizSubmission.model";
import { getObjectId } from "../utils/objectId";
import { IQuestionRepository } from "../interfaces/repositories/IQuestion.repository";

class QuizSubmissionService implements IQuizSubmissionService {
  constructor(
    private _quizSubmissionRepository: IQuizSubmissionRepository,
    private _questionRepository: IQuestionRepository
  ) {}

  public async submitQuiz(
    userId: string,
    quizId: string,
    answers: Array<{ questionId: ObjectId; answer: string }>,
    timeTaken: number
  ): Promise<IQuizSubmission> {
    const questions = await this._questionRepository.getQuestions(quizId);

    const score = questions.reduce((score, question) => {
      const userAnswer = answers.find(
        (answer) => String(answer.questionId) === String(question._id)
      );
      console.log(userAnswer, question);
      if (userAnswer && userAnswer.answer === question.answer) {
        return score + 1;
      }
      return score;
    }, 0);

    return await this._quizSubmissionRepository.create({
      userId: getObjectId(userId),
      quizId: getObjectId(quizId),
      score,
      timeTaken,
      answers,
    });
  }

  public async resubmitQuiz(
    quizSubmissionId: string,
    userId: string,
    quizId: string,
    answers: Array<{ questionId: ObjectId; answer: string }>,
    timeTaken: number
  ): Promise<IQuizSubmission | null> {
    const questions = await this._questionRepository.getQuestions(quizId);

    const score = questions.reduce((score, question) => {
      const userAnswer = answers.find(
        (answer) => String(answer.questionId) === String(question._id)
      );
      console.log(userAnswer, question);
      if (userAnswer && userAnswer.answer === question.answer) {
        return score + 1;
      }
      return score;
    }, 0);

    return await this._quizSubmissionRepository.updateById(quizSubmissionId, {
      userId: getObjectId(userId),
      quizId: getObjectId(quizId),
      score,
      timeTaken,
      answers,
    });
  }

  public async getQuizSubmission(userId: string, quizId: string) {
    return await this._quizSubmissionRepository.getQuizSubmission(
      userId,
      quizId
    );
  }

  public async getUserQuizSubmissionsProgress(
    userId: string
  ): Promise<IQuizSubmission | null> {
    return await this._quizSubmissionRepository.getUserQuizSubmissionsProgress(
      userId
    );
  }
}

export default QuizSubmissionService;
