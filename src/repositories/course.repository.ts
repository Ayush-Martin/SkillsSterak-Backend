import mongoose, { Model } from "mongoose";
import { ICourseRepository } from "../interfaces/repositories/ICourse.repository";
import { ICourse } from "../models/Course.model";
import BaseRepository from "./Base.repository";

class CourseRepository
  extends BaseRepository<ICourse>
  implements ICourseRepository
{
  constructor(private Course: Model<ICourse>) {
    super(Course);
  }

  public async findCourseByTitle(title: string): Promise<ICourse | null> {
    return await this.Course.findOne({ title: new RegExp(title, "i") });
  }

  public async getCourse(courseId: string): Promise<ICourse | null> {
    return await this.Course.findById(courseId);
  }

  public async getCourses(
    search: RegExp,
    skip: number,
    limit: number,
    filter: {
      categoryId?: mongoose.Types.ObjectId;
      difficulty?: "beginner" | "intermediate" | "advance";
      price?: { $eq: 0 } | { $ne: 0 };
    }
  ): Promise<Array<ICourse>> {
    console.log(filter);
    return await this.Course.aggregate([
      {
        $match: {
          isListed: true,
          title: search,
          ...filter,
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
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
  }

  public async getTrainerCourses(
    trainerId: string,
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<ICourse>> {
    return await this.Course.find(
      { title: search, trainerId },
      {
        thumbnail: 1,
        price: 1,
        difficulty: 1,
        title: 1,
        _id: 1,
        categoryId: 1,
        createdAt: 1,
        isListed: 1,
      }
    )
      .skip(skip)
      .limit(limit)
      .populate("categoryId");
  }

  public async getCourseCount(search: RegExp): Promise<number> {
    return await this.Course.countDocuments({ title: search });
  }

  public async getTrainerCourseCount(
    trainerId: string,
    search: RegExp
  ): Promise<number> {
    return await this.Course.countDocuments({ title: search, trainerId });
  }

  public async changeThumbnail(
    courseId: string,
    thumbnail: string
  ): Promise<ICourse | null> {
    return await this.Course.findByIdAndUpdate(courseId, { thumbnail });
  }
}

export default CourseRepository;
