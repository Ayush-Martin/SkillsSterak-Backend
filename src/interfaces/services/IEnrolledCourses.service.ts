import { IEnrolledCourses } from "../../models/EnrolledCourse.model";

export interface IEnrolledCoursesService {
  /**
   * Registers a user for a course, creating an enrollment record. Used when a user initiates a course purchase or joins a free course.
   */
  enrollCourse(
    userId: string,
    courseId: string,
    method?: "wallet" | "stripe"
  ): Promise<string | null>;

  /**
   * Returns a paginated list of all courses a user is enrolled in. Used for user dashboards and course navigation.
   */
  getEnrolledCourses(
    userId: string,
    page: number,
    size: number
  ): Promise<{
    enrolledCourses: Array<IEnrolledCourses>;
    currentPage: number;
    totalPages: number;
  }>;

  /**
   * Returns a paginated list of courses a user has completed. Used for certificates, achievements, and progress tracking.
   */
  getCompletedEnrolledCourses(
    userId: string,
    page: number
  ): Promise<{
    completedEnrolledCourses: Array<IEnrolledCourses>;
    currentPage: number;
    totalPages: number;
  }>;

  /**
   * Fetches a specific enrollment record for a user and course. Used to verify access and display enrollment details.
   */
  getEnrolledCourse(
    userId: string,
    courseId: string
  ): Promise<IEnrolledCourses | null>;

  /**
   * Determines if a user is currently enrolled in a course. Used for access control and UI logic.
   */
  checkEnrolled(userId: string, courseId: string): Promise<boolean>;

  /**
   * Finalizes a course purchase, confirming enrollment and returning identifiers. Used after successful payment or free enrollment.
   */
  completePurchase(
    userId: string,
    courseId: string,
    transactionId: string
  ): Promise<{ userId: string; courseId: string }>;

  /**
   * Toggles the completion status of a lesson for a user in a course. Used for tracking learning progress and unlocking content.
   */
  completeUnCompleteLesson(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<IEnrolledCourses | null>;

  /**
   * Returns the user's overall course completion progress. Used for dashboards, gamification, and analytics.
   */
  getCompletionProgress(userId: string): Promise<IEnrolledCourses>;

  cancelPurchase(transactionId: string): Promise<void>;
}
