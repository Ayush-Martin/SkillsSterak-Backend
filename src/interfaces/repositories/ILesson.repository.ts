import { ILesson } from "../../models/Lesson.model";
import { IBaseRepository } from "./IBase.repository";

/**
 * Repository interface for lesson-specific data operations.
 * Supports modular course design and lesson retrieval for learning flows.
 */
export interface ILessonRepository extends IBaseRepository<ILesson> {
  /**
   * Retrieves all lessons for a given module.
   * Enables sequential content delivery and module-based navigation.
   */
  getLessons(moduleId: string): Promise<Array<ILesson>>;

  /**
   * Retrieves a single lesson by its unique identifier.
   * Supports direct lesson access and deep linking.
   */
  getLesson(lessonId: string): Promise<ILesson | null>;
}
