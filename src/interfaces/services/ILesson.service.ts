import { ILesson } from "../../models/Lesson.model";

export interface ILessonService {
  createLesson(lesson: Partial<ILesson>): Promise<ILesson>;
  getLessons(moduleId: string): Promise<Array<ILesson>>;
  deleteLesson(lessonId: string): Promise<void>;
}
