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
                from: "lessons",
                let: { courseId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$courseId", "$$courseId"] },
                    },
                  },
                  {
                    $count: "lessonCount",
                  },
                ],
                as: "lessonStats",
              },
            },
            {
              $addFields: {
                lessonCount: {
                  $ifNull: [
                    { $arrayElemAt: ["$lessonStats.lessonCount", 0] },
                    0,
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                title: 1,
                thumbnail: 1,
                category: 1,
                lessonCount: 1,
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
        $addFields: {
          completedLessonsCount: {
            $size: {
              $ifNull: ["$completedLessons", []],
            },
          },
        },
      },
      {
        $addFields: {
          completedPercentage: {
            $cond: [
              { $eq: ["$course.lessonCount", 0] },
              0,
              {
                $multiply: [
                  {
                    $divide: ["$completedLessonsCount", "$course.lessonCount"],
                  },
                  100,
                ],
              },
            ],
          },
        },
      },
      {
        $project: {
          updatedAt: 0,
          __v: 0,
          completedLessons: 0,
          completedLessonsCount: 0,
          "course.lessonCount": 0,
          courseId: 0,
          userId: 0,
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

  public async getComptedEnrolledCourses(
    userId: string,
    skip: number,
    limit: number
  ): Promise<Array<IEnrolledCourses>> {
    return await this.EnrolledCourses.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          pipeline: [
            {
              $lookup: {
                from: "lessons",
                localField: "_id",
                foreignField: "courseId",
                pipeline: [
                  {
                    $count: "totalLessons",
                  },
                ],
                as: "totalLessons",
              },
            },
            {
              $unwind: "$totalLessons",
            },
            {
              $lookup: {
                from: "users",
                localField: "trainerId",
                foreignField: "_id",
                as: "trainer",
              },
            },
            {
              $unwind: "$trainer",
            },
            {
              $project: {
                _id: 1,
                title: 1,
                thumbnail: 1,
                trainer: {
                  _id: 1,
                  username: 1,
                  email: 1,
                },
                totalLessonsCount: "$totalLessons.totalLessons",
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
        $addFields: {
          completedLessonsCount: {
            $size: "$completedLessons",
          },
          totalLessonsCount: "$course.totalLessonsCount",
        },
      },
      {
        $match: {
          $expr: {
            $eq: ["$completedLessonsCount", "$totalLessonsCount"],
          },
        },
      },
      {
        $project: {
          completedLessonsCount: 0,
          totalLessonsCount: 0,
          createdAt: 0,
          updatedAt: 0,
          completedLessons: 0,
          __v: 0,
          courseId: 0,
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

  public async getCompletedEnrolledCoursesCount(
    userId: string
  ): Promise<number> {
    const enrolledCourses = await this.EnrolledCourses.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          pipeline: [
            {
              $lookup: {
                from: "lessons",
                localField: "_id",
                foreignField: "courseId",
                pipeline: [
                  {
                    $count: "totalLessons",
                  },
                ],
                as: "totalLessons",
              },
            },
            {
              $unwind: "$totalLessons",
            },
          ],
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $addFields: {
          completedLessonsCount: {
            $size: "$completedLessons",
          },
          totalLessonsCount: "$course.totalLessons.totalLessons",
        },
      },
      {
        $match: {
          $expr: {
            $eq: ["$completedLessonsCount", "$totalLessonsCount"],
          },
        },
      },
      {
        $group: {
          _id: null,
          enrolledCoursesCompletedCount: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          enrolledCoursesCompletedCount: 1,
        },
      },
    ]);

    if (enrolledCourses.length === 0) {
      return 0;
    }

    return enrolledCourses[0]["enrolledCoursesCompletedCount"];
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
