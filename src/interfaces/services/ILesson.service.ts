import { ILesson } from "../../models/Lesson.model";

export interface ILessonService {
  createLesson(lesson: Partial<ILesson>): Promise<ILesson>;
  getLessons(moduleId: string): Promise<Array<ILesson>>;
  getLesson(lessonId: string): Promise<ILesson | null>;
  deleteLesson(lessonId: string): Promise<void>;
}
