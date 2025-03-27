import mongoose from "mongoose";
import { ICourse } from "../../models/Course.model";
import BaseRepository from "../../repositories/Base.repository";

export interface ICourseRepository extends BaseRepository<ICourse> {
  /** Finds course by title. */
  findCourseByTitle(title: string): Promise<ICourse | null>;

  /** Gets course by id. */
  getCourse(courseId: string): Promise<ICourse | null>;

  /** Gets trainer course by id. */
  getTrainerCourse(courseId: string): Promise<ICourse | null>;

  /** Changes course list status. */
  changeListStatus(
    courseId: string,
    isListed: boolean
  ): Promise<ICourse | null>;

  /** Gets course listed status. */
  getCourseListedStatus(categoryId: string): Promise<boolean | null>;

  /** Changes course status. */
  changeCourseStatus(courseId: string, status: string): Promise<ICourse | null>;

  /** Gets courses. */
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

  /** Gets trainer courses. */
  getTrainerCourses(
    trainerId: string,
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<ICourse>>;

  /** Gets admin courses. */
  getAdminCourses(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<ICourse>>;

  /** Gets course count. */
  getCourseCount(search: RegExp): Promise<number>;

  /** Gets Admin all courses count. */
  getAdminCourseCount(search: RegExp): Promise<number>;

  /** Gets trainer course count. */
  getTrainerCourseCount(trainerId: string, search: RegExp): Promise<number>;

  /** Changes thumbnail. */
  changeThumbnail(courseId: string, thumbnail: string): Promise<ICourse | null>;
}
