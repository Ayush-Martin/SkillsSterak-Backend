import { ICourse } from "../../models/Course.model";

/**
 * Repository interface for AI chat-related course outline operations.
 * Abstracts persistence and retrieval of course outline data for AI-driven features.
 */
export interface IAiChatRepository {
  /**
   * Retrieves the outline data for a course, enabling AI chat to provide context-aware responses.
   * Returns null if the course outline is not found.
   */
  getCourseOutlineData(courseId: string): Promise<ICourse | null>;

  /**
   * Persists or updates the outline data for a course.
   * Used to keep AI chat context in sync with course content changes.
   */
  setCourseOutlineData(courseId: string, data: ICourse): Promise<void>;
}
