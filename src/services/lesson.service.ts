import { ILessonRepository } from "../interfaces/repositories/ILesson.repository";
import { ILessonService } from "../interfaces/services/ILesson.service";
import { ILesson } from "../models/Lesson.model";

class LessonService implements ILessonService {
  constructor(private _lessonRepository: ILessonRepository) {}

  public async createLesson(lesson: Partial<ILesson>): Promise<ILesson> {
    return await this._lessonRepository.create(lesson);
  }

  public async getLessons(moduleId: string): Promise<Array<ILesson>> {
    return await this._lessonRepository.getLessons(moduleId);
  }

  public async getLesson(lessonId: string): Promise<ILesson | null> {
    return await this._lessonRepository.getLesson(lessonId);
  }

  public async deleteLesson(lessonId: string): Promise<void> {
    await this._lessonRepository.deleteById(lessonId);
  }

  public async updateLesson(
    lessonId: string,
    lesson: Partial<ILesson>
  ): Promise<ILesson | null> {
    return await this._lessonRepository.updateById(lessonId, lesson);
  }
}

export default LessonService;
