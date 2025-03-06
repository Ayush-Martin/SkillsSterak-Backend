import { ILesson } from "../../models/Lesson.model";
import { IBaseRepository } from "./IBase.repository";

export interface ILessonRepository extends IBaseRepository<ILesson> {
  getLessons(moduleId: string): Promise<Array<ILesson>>;
  getLesson(lessonId: string): Promise<ILesson | null>;
}
