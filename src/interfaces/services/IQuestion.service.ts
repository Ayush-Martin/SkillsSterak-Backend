import { IQuestion } from "../../models/Question.model";

export interface IQuestionService {
  addQuestion(
    quizId: string,
    question: string,
    options: Array<{ id: string; choice: string }>,
    answer: string
  ): Promise<IQuestion>;
  editQuestion(
    questionId: string,
    question: string,
    options: Array<{ id: string; choice: string }>,
    answer: string
  ): Promise<IQuestion | null>;
  deleteQuestion(questionId: string): Promise<void>;
  getQuestions(quizId: string): Promise<IQuestion[]>;
}
