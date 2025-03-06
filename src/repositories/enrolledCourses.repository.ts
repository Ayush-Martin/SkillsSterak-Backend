import mongoose, { Model } from "mongoose";
import { IEnrolledCoursesRepository } from "../interfaces/repositories/IEnrolledCourses.repository";
import { IEnrolledCourses } from "../models/EnrolledCourse.model";
import BaseRepository from "./Base.repository";

class EnrolledCoursesRepository
  extends BaseRepository<IEnrolledCourses>
  implements IEnrolledCoursesRepository
{
  constructor(private EnrolledCourses: Model<IEnrolledCourses>) {
    super(EnrolledCourses);
  }

  public async getEnrolledCourseByCourseId(
    userId: string,
    courseId: string
  ): Promise<IEnrolledCourses | null> {
    return await this.EnrolledCourses.findOne({ userId, courseId });
  }

  public async getEnrolledCourses(
    userId: string,
    skip: number,
    limit: number
  ): Promise<Array<IEnrolledCourses>> {
    return this.EnrolledCourses.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          pipeline: [
            {
              $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                pipeline: [
                  {
                    $match: {
                      isListed: true,
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      categoryName: 1,
                    },
                  },
                ],
                as: "category",
              },
            },
            {
              $unwind: "$category",
            },
            {
              $lookup: {
                from: "modules",
                localField: "_id",
                foreignField: "courseId",
                pipeline: [
                  {
                    $count: "moduleCount",
                  },
                ],
                as: "moduleCount",
              },
            },
            {
              $unwind: {
                path: "$moduleCount",
              },
            },
            {
              $project: {
                _id: 1,
                trainerId: 1,
                title: 1,
                price: 1,
                difficulty: 1,
                thumbnail: 1,
                category: 1,
                moduleCount: "$moduleCount.moduleCount",
              },
            },
          ],
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $project: {
          createdAt: 0,
          updatedAt: 0,
          completedLessons: 0,
          __v: 0,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
  }

  public async getEnrolledCoursesCount(userId: string): Promise<number> {
    return await this.EnrolledCourses.countDocuments({ userId });
  }

  public async checkEnrolled(
    userId: string,
    courseId: string
  ): Promise<IEnrolledCourses | null> {
    return await this.EnrolledCourses.findOne({ userId, courseId });
  }

  public async addLessonComplete(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<IEnrolledCourses | null> {
    return await this.EnrolledCourses.findOneAndUpdate(
      { userId, courseId },
      { $addToSet: { completedLessons: lessonId } }
    );
  }

  public async removeLessonComplete(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<IEnrolledCourses | null> {
    return await this.EnrolledCourses.findOneAndUpdate(
      { userId, courseId },
      { $pull: { completedLessons: lessonId } }
    );
  }
}

export default EnrolledCoursesRepository;
