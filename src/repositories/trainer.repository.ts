import mongoose, { Model } from "mongoose";
import { ITrainerRepository } from "../interfaces/repositories/ITrainer.repository";
import { IUser } from "../models/User.model";
import BaseRepository from "./Base.repository";

class TrainerRepository
  extends BaseRepository<IUser>
  implements ITrainerRepository
{
  constructor(private User: Model<IUser>) {
    super(User);
  }

  public async getAllTrainers(): Promise<Array<IUser>> {
    return await this.User.find({ role: "trainer" }, { username: 1 });
  }

  public async getTrainers(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<IUser>> {
    return await this.User.find({ email: search, role: "trainer" })
      .skip(skip)
      .limit(limit);
  }

  public async getTrainer(trainerId: string): Promise<IUser | null> {
    const trainer = await this.User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(trainerId),
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "trainerId",
          pipeline: [
            {
              $match: {
                isListed: true,
                status: "approved",
              },
            },
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
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "enrolledcourses",
                localField: "_id",
                foreignField: "courseId",
                pipeline: [
                  {
                    $count: "noOfEnrolled",
                  },
                ],
                as: "noOfEnrolled",
              },
            },
            {
              $unwind: {
                path: "$noOfEnrolled",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "courseId",
                pipeline: [
                  {
                    $group: {
                      _id: "$courseId",
                      averageRating: { $avg: "$rating" },
                    },
                  },
                ],
                as: "reviews_summary",
              },
            },
            {
              $unwind: {
                path: "$reviews_summary",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $addFields: {
                averageRating: {
                  $ifNull: ["$reviews_summary.averageRating", 0],
                },
              },
            },

            {
              $project: {
                _id: 1,
                averageRating: 1,
                trainerId: 1,
                title: 1,
                price: 1,
                difficulty: 1,
                thumbnail: 1,
                category: 1,
                moduleCount: {
                  $ifNull: ["$moduleCount.moduleCount", 0],
                },
                noOfEnrolled: {
                  $ifNull: ["$noOfEnrolled.noOfEnrolled", 0],
                },
              },
            },
          ],
          as: "courses",
        },
      },
      {
        $project: {
          courses: 1,
          username: 1,
          email: 1,
          profileImage: 1,
          about: 1,
          bio: 1,
          company: 1,
          position: 1,
          yearsOfExperience: 1,
          github: 1,
          linkedin: 1,
          website: 1,
          educationalQualification: 1,
          skills: 1,
          place: 1,
        },
      },
    ]);

    return trainer[0];
  }

  public async countTrainers(search: RegExp): Promise<number> {
    return await this.User.countDocuments({ email: search });
  }

  public async changeRole(
    userId: string,
    role: "user" | "trainer"
  ): Promise<IUser | null> {
    return await this.User.findByIdAndUpdate(userId, { role }, { new: true });
  }

  public async getTotalStudents(
    trainerId: string,
    search: RegExp
  ): Promise<number> {
    const result = await this.User.aggregate([
      {
        $match: {
          role: { $ne: "admin" },
          _id: { $ne: new mongoose.Types.ObjectId(trainerId) },
          email: search,
        },
      },
      {
        $lookup: {
          from: "enrolledcourses",
          localField: "_id",
          foreignField: "userId",
          pipeline: [
            {
              $lookup: {
                from: "courses",
                localField: "courseId",
                foreignField: "_id",
                pipeline: [
                  {
                    $match: {
                      trainerId: new mongoose.Types.ObjectId(trainerId),
                    },
                  },
                ],
                as: "course",
              },
            },
            { $unwind: "$course" },
          ],
          as: "enrolledCourses",
        },
      },
      {
        $match: {
          "enrolledCourses.course": { $exists: true },
        },
      },
      {
        $group: {
          _id: null,
          totalStudents: { $count: {} },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    return result[0]?.totalStudents || 0;
  }

  public async getStudentsIds(trainerId: string): Promise<Array<string>> {
    const users = await this.User.aggregate([
      {
        $match: {
          _id: {
            $ne: new mongoose.Types.ObjectId(trainerId),
          },
          role: { $ne: "admin" },
        },
      },
      {
        $lookup: {
          from: "enrolledcourses",
          localField: "_id",
          foreignField: "userId",
          as: "enrollments",
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "enrollments.courseId",
          foreignField: "_id",
          as: "courses",
        },
      },
      {
        $match: {
          "courses.trainerId": new mongoose.Types.ObjectId(trainerId),
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);

    return users.map((user) => user._id.toString());
  }

  public async getStudentsWithEnrolledCourses(
    trainerId: string,
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<IUser>> {
    return await this.User.aggregate([
      {
        $match: {
          _id: {
            $ne: new mongoose.Types.ObjectId(trainerId),
          },
          role: {
            $ne: "admin",
          },
          email: search,
        },
      },
      {
        $lookup: {
          from: "enrolledcourses",
          localField: "_id",
          foreignField: "userId",
          pipeline: [
            {
              $lookup: {
                from: "courses",
                localField: "courseId",
                foreignField: "_id",
                pipeline: [
                  {
                    $match: {
                      trainerId: new mongoose.Types.ObjectId(trainerId),
                    },
                  },
                  {
                    $project: {
                      title: 1,
                      thumbnail: 1,
                    },
                  },
                ],
                as: "course",
              },
            },
            { $unwind: "$course" },
            {
              $project: {
                course: 1,
                _id: 0,
              },
            },
          ],
          as: "enrolledCourses",
        },
      },
      {
        $unwind: "$enrolledCourses",
      },
      {
        $group: {
          _id: "$_id",
          enrolledCourses: {
            $push: "$enrolledCourses.course",
          },
          username: { $first: "$username" },
          email: { $first: "$email" },
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
}

export default TrainerRepository;
