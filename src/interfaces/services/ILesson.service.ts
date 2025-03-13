import { ILesson } from "../../models/Lesson.model";

export interface ILessonService {
  /** Creates a new lesson */
  createLesson(lesson: Partial<ILesson>): Promise<ILesson>;
  /** Returns all lessons that belong to a specific module */
  getLessons(moduleId: string): Promise<Array<ILesson>>;
  /** Returns a single lesson by id */
  getLesson(lessonId: string): Promise<ILesson | null>;
  /** Deletes a lesson */
  deleteLesson(lessonId: string): Promise<void>;
  /** Updates a lesson */
  updateLesson(
    lessonId: string,
    lesson: Partial<ILesson>
  ): Promise<ILesson | null>;
}
