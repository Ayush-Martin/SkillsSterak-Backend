import { ILesson } from "../../models/Lesson.model";

export interface ILessonService {
  /**
   * Persists a new lesson within a module. Used by trainers to build course content incrementally.
   */
  createLesson(lesson: Partial<ILesson>): Promise<ILesson>;

  /**
   * Retrieves all lessons for a given module. Used to display module content and for curriculum navigation.
   */
  getLessons(moduleId: string): Promise<Array<ILesson>>;

  /**
   * Fetches a single lesson by its unique identifier. Used for lesson detail views and editing.
   */
  getLesson(lessonId: string): Promise<ILesson | null>;

  /**
   * Removes a lesson from the system. Used by trainers to manage and update course structure.
   */
  deleteLesson(lessonId: string): Promise<void>;

  /**
   * Updates lesson details such as title, content, or resources. Used for lesson editing and versioning.
   */
  updateLesson(
    lessonId: string,
    lesson: Partial<ILesson>
  ): Promise<ILesson | null>;
}
