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
                  { $match: { $expr: { $eq: ["$courseId", "$$courseId"] } } },
                  { $count: "lessonCount" },
                ],
                as: "lessonStats",
              },
            },
            {
              $lookup: {
                from: "assignments",
                let: { courseId: "$_id" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$courseId", "$$courseId"] } } },
                  { $count: "assignmentCount" },
                ],
                as: "assignmentStats",
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
                assignmentCount: {
                  $ifNull: [
                    { $arrayElemAt: ["$assignmentStats.assignmentCount", 0] },
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
                assignmentCount: 1,
              },
            },
          ],
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $addFields: {
          completedLessonsCount: {
            $size: { $ifNull: ["$completedLessons", []] },
          },
          completedAssignmentsCount: {
            $size: { $ifNull: ["$completedAssignments", []] },
          },
        },
      },
      {
        $addFields: {
          totalItems: {
            $add: ["$course.lessonCount", "$course.assignmentCount"],
          },
          totalCompleted: {
            $add: ["$completedLessonsCount", "$completedAssignmentsCount"],
          },
        },
      },
      {
        $addFields: {
          completedPercentage: {
            $cond: [
              { $eq: ["$totalItems", 0] },
              0,
              {
                $multiply: [
                  { $divide: ["$totalCompleted", "$totalItems"] },
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
          completedAssignments: 0,
          completedLessonsCount: 0,
          completedAssignmentsCount: 0,
          "course.lessonCount": 0,
          "course.assignmentCount": 0,
          courseId: 0,
          userId: 0,
        },
      },
      { $skip: skip },
      { $limit: limit },
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

  public async getProgress(userId: string): Promise<IEnrolledCourses> {
    const courseProgress = await this.EnrolledCourses.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $facet: {
          enrolledCourses: [
            {
              $group: {
                _id: null,
                enrolledCourses: { $sum: 1 },
              },
            },
          ],
          coursesCompleted: [
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
                          $group: {
                            _id: null,
                            noOfLessons: { $sum: 1 },
                          },
                        },
                      ],
                      as: "lessons",
                    },
                  },
                  { $unwind: "$lessons" },
                  {
                    $lookup: {
                      from: "assignments",
                      localField: "_id",
                      foreignField: "courseId",
                      pipeline: [
                        {
                          $group: {
                            _id: null,
                            noOfAssignments: {
                              $sum: 1,
                            },
                          },
                        },
                      ],
                      as: "assignments",
                    },
                  },
                  {
                    $unwind: {
                      path: "$assignments",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                  {
                    $lookup: {
                      from: "assignmentsubmissions",
                      localField: "_id",
                      foreignField: "courseId",
                      pipeline: [
                        {
                          $match: {
                            status: "verified",
                          },
                        },
                        {
                          $group: {
                            _id: null,
                            noOfAssignmentSubmissions: { $sum: 1 },
                          },
                        },
                      ],
                      as: "assignmentSubmissions",
                    },
                  },
                  {
                    $unwind: {
                      path: "$assignmentSubmissions",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                  {
                    $project: {
                      noOfLessons: "$lessons.noOfLessons",
                      noOfAssignments: {
                        $ifNull: ["$assignments.noOfAssignments", 0],
                      },
                      noOfAssignmentSubmissions: {
                        $ifNull: [
                          "$assignmentSubmissions.noOfAssignmentSubmissions",
                          0,
                        ],
                      },
                    },
                  },
                ],
                as: "course",
              },
            },
            { $unwind: "$course" },
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        {
                          $size: "$completedLessons",
                        },
                        "$course.noOfLessons",
                      ],
                    },
                    {
                      $eq: [
                        "$course.noOfAssignments",
                        "$course.noOfAssignmentSubmissions",
                      ],
                    },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                coursesCompleted: { $sum: 1 },
              },
            },
          ],
        },
      },
      {
        $project: {
          enrolledCourses: {
            $ifNull: [
              {
                $arrayElemAt: ["$enrolledCourses.enrolledCourses", 0],
              },
              0,
            ],
          },
          coursesCompleted: {
            $ifNull: [
              {
                $arrayElemAt: ["$coursesCompleted.coursesCompleted", 0],
              },
              0,
            ],
          },
        },
      },
    ]);

    return courseProgress[0];
  }

  public async deleteUserCourseEnrollment(
    userId: string,
    courseId: string
  ): Promise<void> {
    await this.EnrolledCourses.deleteOne({ userId, courseId });
  }

  public async getEnrolledCourseCompletionStatus(
    userId: string,
    courseId: string
  ): Promise<IEnrolledCourses | null> {
    const data = await this.EnrolledCourses.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          courseId: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $lookup: {
          from: "lessons",
          localField: "courseId",
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
        $unwind: {
          path: "$totalLessons",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "assignments",
          localField: "courseId",
          foreignField: "courseId",
          pipeline: [
            {
              $count: "totalAssignments",
            },
          ],
          as: "totalAssignments",
        },
      },
      {
        $unwind: {
          path: "$totalAssignments",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "assignmentsubmissions",
          localField: "courseId",
          foreignField: "courseId",
          pipeline: [
            {
              $match: {
                userId: new mongoose.Types.ObjectId(userId),
                courseId: new mongoose.Types.ObjectId(courseId),
                status: "verified",
              },
            },
            {
              $count: "completedAssignments",
            },
          ],
          as: "completedAssignments",
        },
      },
      {
        $unwind: {
          path: "$completedAssignments",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          totalLessons: {
            $ifNull: ["$totalLessons.totalLessons", 0],
          },
          completedLessons: {
            $size: "$completedLessons",
          },
          totalAssignments: {
            $ifNull: ["$totalAssignments.totalAssignments", 0],
          },
          completedAssignments: {
            $ifNull: ["$completedAssignments.completedAssignments", 0],
          },
        },
      },
    ]);

    console.log(data);
    return data[0];
  }
}

export default EnrolledCoursesRepository;
