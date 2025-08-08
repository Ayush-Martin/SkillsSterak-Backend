import { ObjectId } from "mongoose";
import { IQuiz } from "./../../models/Quiz.model";
export interface IQuizService {
  addQuiz(
    title: string,
    description: string,
    difficulty: "beginner" | "intermediate" | "advance",
    topics: Array<ObjectId>
  ): Promise<IQuiz>;
  listUnlistQuiz(quizId: string): Promise<boolean>;
  editQuiz(
    quizId: string,
    title: string,
    description: string,
    difficulty: "beginner" | "intermediate" | "advance",
    topics: Array<ObjectId>
  ): Promise<IQuiz | null>;
  getAdminQuizzes(
    search: string,
    page: number,
    size: number
  ): Promise<{
    quizzes: Array<IQuiz>;
    currentPage: number;
    totalPages: number;
  }>;
  getAdminQuiz(quizId: string): Promise<IQuiz | null>;
}
