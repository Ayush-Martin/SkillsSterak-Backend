import { ILessonRepository } from "../interfaces/repositories/ILesson.repository";
import { ILessonService } from "../interfaces/services/ILesson.service";
import { ILesson } from "../models/Lesson.model";

class LessonService implements ILessonService {
  constructor(private lessonRepository: ILessonRepository) {}

  public async createLesson(lesson: Partial<ILesson>): Promise<ILesson> {
    return await this.lessonRepository.create(lesson);
  }

  public async getLessons(moduleId: string): Promise<Array<ILesson>> {
    return await this.lessonRepository.getLessons(moduleId);
  }

  public async getLesson(lessonId: string): Promise<ILesson | null> {
    return await this.lessonRepository.getLesson(lessonId);
  }

  public async deleteLesson(lessonId: string): Promise<void> {
    await this.lessonRepository.deleteById(lessonId);
  }
}

export default LessonService;
