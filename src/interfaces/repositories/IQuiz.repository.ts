import { IQuiz } from "../../models/Quiz.model";
import { IBaseRepository } from "./IBase.repository";

export interface IQuizRepository extends IBaseRepository<IQuiz> {
  getQuizByTitle(Title: string): Promise<IQuiz | null>;
  getQuizListedStatus(quizId: string): Promise<IQuiz | null>;
  changeQuizListedStatus(
    quizId: string,
    isListed: boolean
  ): Promise<IQuiz | null>;
  getAdminQuizzes(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<IQuiz>>;
  getAdminQuizzesCount(search: RegExp): Promise<number>;
  getUserQuizzes(
    userId: string,
    search: RegExp,
    skip: number,
    limit: number,
    filter: Record<string, any>
  ): Promise<Array<IQuiz>>;
  getUserQuizzesCount(
    search: RegExp,
    filter: Record<string, any>
  ): Promise<number>;
  getUserQuiz(quizId: string): Promise<IQuiz | null>;
}
