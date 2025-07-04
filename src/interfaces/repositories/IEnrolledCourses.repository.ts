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
  /** Check if the user is enrolled in the course */
  checkEnrolled(
    userId: string,
    courseId: string
  ): Promise<IEnrolledCourses | null>;
  /** Get completed enrolled courses of the user */
  getComptedEnrolledCourses(
    userId: string,
    skip: number,
    limit: number
  ): Promise<Array<IEnrolledCourses>>;
  /** Add a lesson as completed in the user's enrolled course */
  addLessonComplete(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<IEnrolledCourses | null>;

  /** Remove a lesson from completed lessons in the user's enrolled course */
  removeLessonComplete(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<IEnrolledCourses | null>;

  getProgress(userId: string): Promise<IEnrolledCourses>;
}
