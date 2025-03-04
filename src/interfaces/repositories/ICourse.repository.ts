import mongoose from "mongoose";
import { ICourse } from "../../models/Course.model";
import BaseRepository from "../../repositories/Base.repository";

export interface ICourseRepository extends BaseRepository<ICourse> {
  findCourseByTitle(title: string): Promise<ICourse | null>;
  getCourse(courseId: string): Promise<ICourse | null>;
  getCourses(
    search: RegExp,
    skip: number,
    limit: number,
    filter: {
      categoryId?: mongoose.Types.ObjectId;
      difficulty?: "beginner" | "intermediate" | "advance";
      price?: { $eq: 0 } | { $ne: 0 };
    }
  ): Promise<Array<ICourse>>;
  getTrainerCourses(
    trainerId: string,
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<ICourse>>;
  getCourseCount(search: RegExp): Promise<number>;
  getTrainerCourseCount(trainerId: string, search: RegExp): Promise<number>;
  changeThumbnail(courseId: string, thumbnail: string): Promise<ICourse | null>;
}
