import mongoose from "mongoose";
import { ICourse } from "../../models/Course.model";
import BaseRepository from "../../repositories/Base.repository";

export interface ICourseRepository extends BaseRepository<ICourse> {
  /** Get a course by its Course Title */
  findCourseByTitle(title: string): Promise<ICourse | null>;

  /** Get a course by its ID */
  getCourse(courseId: string): Promise<ICourse | null>;

  /** Get a trainer's course by course ID */
  getTrainerCourse(courseId: string): Promise<ICourse | null>;

  /** Change the listed status of a course */
  changeListStatus(
    courseId: string,
    isListed: boolean
  ): Promise<ICourse | null>;

  /** Get the listed status of a course by category ID */
  getCourseListedStatus(categoryId: string): Promise<boolean | null>;

  /** Change the status of a course (e.g., approved, rejected) */
  changeCourseStatus(courseId: string, status: string): Promise<ICourse | null>;

  /** Get all courses with filters, pagination, and sorting */
  getCourses(
    search: RegExp,
    skip: number,
    limit: number,
    filter: {
      categoryId?: mongoose.Types.ObjectId;
      difficulty?: "beginner" | "intermediate" | "advance";
      price?: { $eq: 0 } | { $ne: 0 };
    },
    sortQuery: { createdAt?: -1; price?: -1 | 1; title?: -1 | 1 }
  ): Promise<Array<ICourse>>;

  /** Get all courses for a trainer with pagination and search */
  getTrainerCourses(
    trainerId: string,
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<ICourse>>;

  /** Get all courses for admin with pagination and search */
  getAdminCourses(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<ICourse>>;

  /**
   * Returns the total number of courses matching a search and filter.
   * Supports pagination and analytics for course listings.
   */
  getCourseCount(
    search: RegExp,
    filter: {
      categoryId?: mongoose.Types.ObjectId;
      difficulty?: "beginner" | "intermediate" | "advance";
      price?: { $eq: 0 } | { $ne: 0 };
    }
  ): Promise<number>;

  /**
   * Retrieves the outline (structure) of a course by its ID.
   * Used for displaying course content and supporting AI-driven features.
   */
  getCourseOutline(courseId: string): Promise<ICourse | null>;

  /**
   * Returns the total number of admin-created courses matching a search.
   * Enables admin analytics and dashboard statistics.
   */
  getAdminCourseCount(search: RegExp): Promise<number>;

  /**
   * Returns the total number of courses for a trainer matching a search.
   * Supports trainer dashboards and reporting features.
   */
  getTrainerCourseCount(trainerId: string, search: RegExp): Promise<number>;

  /**
   * Updates the thumbnail image for a course.
   * Allows trainers and admins to refresh course visuals.
   */
  changeThumbnail(courseId: string, thumbnail: string): Promise<ICourse | null>;

  /**
   * Retrieves the top 5 courses for admin analytics or featured listings.
   * Used for highlighting popular or high-performing courses on the platform.
   */
  getAdminTop5Courses(): Promise<Array<ICourse>>;

  /**
   * Retrieves the top 5 courses for a specific trainer.
   * Supports trainer dashboards and recognition features.
   */
  getTrainerTop5Courses(trainerId: string): Promise<Array<ICourse>>;

  getAdminCourse(courseId: string): Promise<ICourse | null>;

  getCourseCertificateInfo(courseId: string): Promise<ICourse | null>;

  getTrainerCoursesList(trainerId: string): Promise<Array<ICourse>>;
}
