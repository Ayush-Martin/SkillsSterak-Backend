import { IEnrolledCourses } from "../../models/EnrolledCourse.model";
import { IBaseRepository } from "./IBase.repository";

export interface IEnrolledCoursesRepository
  extends IBaseRepository<IEnrolledCourses> {
  getEnrolledCourses(
    userId: string,
    skip: number,
    limit: number
  ): Promise<Array<IEnrolledCourses>>;
  getEnrolledCoursesCount(userId: string): Promise<number>;
  getCompletedEnrolledCoursesCount(userId: string): Promise<number>;
  getEnrolledCourseByCourseId(
    userId: string,
    courseId: string
  ): Promise<IEnrolledCourses | null>;
  checkEnrolled(
    userId: string,
    courseId: string
  ): Promise<IEnrolledCourses | null>;
  getComptedEnrolledCourses(
    userId: string,
    skip: number,
    limit: number
  ): Promise<Array<IEnrolledCourses>>;
  addLessonComplete(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<IEnrolledCourses | null>;

  removeLessonComplete(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<IEnrolledCourses | null>;
}
