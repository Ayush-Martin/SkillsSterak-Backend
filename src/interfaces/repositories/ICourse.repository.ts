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

  /** Get the total count of courses matching a search */
  getCourseCount(search: RegExp): Promise<number>;

  /** Get the outline of a course by ID */
  getCourseOutline(courseId: string): Promise<ICourse | null>;

  /** Get the total count of admin courses matching a search */
  getAdminCourseCount(search: RegExp): Promise<number>;

  /** Get the total count of trainer courses matching a search */
  getTrainerCourseCount(trainerId: string, search: RegExp): Promise<number>;

  /** Change the thumbnail of a course */
  changeThumbnail(courseId: string, thumbnail: string): Promise<ICourse | null>;
}
