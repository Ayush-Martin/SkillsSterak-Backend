import { IQuestionRepository } from "../interfaces/repositories/IQuestion.repository";
import { IQuestionService } from "../interfaces/services/IQuestion.service";
import { IQuestion } from "../models/Question.model";
import { getObjectId } from "../utils/objectId";

class QuestionService implements IQuestionService {
  constructor(private _questionRepository: IQuestionRepository) {}

  public async addQuestion(
    quizId: string,
    question: string,
    options: Array<{ id: string; choice: string }>,
    answer: string
  ): Promise<IQuestion> {
    return await this._questionRepository.create({
      quizId: getObjectId(quizId),
      question,
      options,
      answer,
    });
  }

  public async editQuestion(
    questionId: string,
    question: string,
    options: Array<{ id: string; choice: string }>,
    answer: string
  ): Promise<IQuestion | null> {
    return await this._questionRepository.updateById(questionId, {
      question,
      options,
      answer,
    });
  }

  public async getQuestions(quizId: string): Promise<IQuestion[]> {
    return await this._questionRepository.getQuestions(quizId);
  }

  public async deleteQuestion(questionId: string): Promise<void> {
    return await this._questionRepository.deleteById(questionId);
  }
}

export default QuestionService;
