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
