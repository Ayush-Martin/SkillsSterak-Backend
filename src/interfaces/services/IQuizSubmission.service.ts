import { ObjectId } from "mongoose";
import { IQuizSubmission } from "../../models/QuizSubmission.model";

export interface IQuizSubmissionService {
  submitQuiz(
    userId: string,
    quizId: string,
    answers: Array<{ questionId: ObjectId; answer: string }>,
    timeTaken: number
  ): Promise<IQuizSubmission>;

  resubmitQuiz(
    quizSubmissionId: string,
    userId: string,
    quizId: string,
    answers: Array<{ questionId: ObjectId; answer: string }>,
    timeTaken: number
  ): Promise<IQuizSubmission | null>;

  getQuizSubmission(
    userId: string,
    quizId: string
  ): Promise<IQuizSubmission | null>;

  getUserQuizSubmissionsProgress(
    userId: string
  ): Promise<IQuizSubmission | null>;
}
