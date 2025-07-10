import { IEnrolledCourses } from "../../models/EnrolledCourse.model";
import { IBaseRepository } from "./IBase.repository";

export interface IEnrolledCoursesRepository
  extends IBaseRepository<IEnrolledCourses> {
  /** Get enrolled courses of the user */
  getEnrolledCourses(
    userId: string,
    skip: number,
    limit: number
  ): Promise<Array<IEnrolledCourses>>;
  /** Get enrolled courses count of the user */
  getEnrolledCoursesCount(userId: string): Promise<number>;
  /** Get completed enrolled courses count of the user */
  getCompletedEnrolledCoursesCount(userId: string): Promise<number>;
  /** Get enrolled course of the user by course id */
  getEnrolledCourseByCourseId(
    userId: string,
    courseId: string
  ): Promise<IEnrolledCourses | null>;
  /**
   * Checks if the user is enrolled in a specific course.
   * Supports access control and prevents duplicate enrollments.
   */
  checkEnrolled(
    userId: string,
    courseId: string
  ): Promise<IEnrolledCourses | null>;

  /**
   * Retrieves the user's completed enrolled courses with pagination.
   * Enables progress tracking and certificate eligibility checks.
   */
  getComptedEnrolledCourses(
    userId: string,
    skip: number,
    limit: number
  ): Promise<Array<IEnrolledCourses>>;

  /**
   * Marks a lesson as completed for the user's enrolled course.
   * Used to update progress and unlock subsequent content.
   */
  addLessonComplete(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<IEnrolledCourses | null>;

  /**
   * Removes a lesson from the user's completed lessons.
   * Supports progress correction and user-driven adjustments.
   */
  removeLessonComplete(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<IEnrolledCourses | null>;

  /**
   * Retrieves the user's overall course progress.
   * Used for dashboards, analytics, and personalized recommendations.
   */
  getProgress(userId: string): Promise<IEnrolledCourses>;

  deleteUserCourseEnrollment(userId: string, courseId: string): Promise<void>;
}
