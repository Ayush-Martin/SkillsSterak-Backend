import { IQuestion } from "../../models/Question.model";
import { IBaseRepository } from "./IBase.repository";

export interface IQuestionRepository extends IBaseRepository<IQuestion> {
  getQuestions(quizId: string): Promise<IQuestion[]>;
}
