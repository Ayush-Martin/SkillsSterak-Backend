import { ILesson } from "../../models/Lesson.model";
import { IBaseRepository } from "./IBase.repository";

export interface ILessonRepository extends IBaseRepository<ILesson> {
  /** Returns all lessons that belong to a specific module */
  getLessons(moduleId: string): Promise<Array<ILesson>>;
  /** Returns a single lesson by id */
  getLesson(lessonId: string): Promise<ILesson | null>;
}
