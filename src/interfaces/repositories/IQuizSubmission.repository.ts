import { IQuizSubmission } from "../../models/QuizSubmission.model";
import { IBaseRepository } from "./IBase.repository";

export interface IQuizSubmissionRepository
  extends IBaseRepository<IQuizSubmission> {
  getQuizSubmission(
    userId: string,
    quizId: string
  ): Promise<IQuizSubmission | null>;
}
