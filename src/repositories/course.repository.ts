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

  public async changeListStatus(
    courseId: string,
    isListed: boolean
  ): Promise<ICourse | null> {
    return await this.Course.findByIdAndUpdate(courseId, { isListed });
  }

  public async changeCourseStatus(
    courseId: string,
    status: string
  ): Promise<ICourse | null> {
    return await this.Course.findByIdAndUpdate(
      courseId,
      { status },
      { new: true }
    );
  }

  public async getCourseListedStatus(
    categoryId: string
  ): Promise<boolean | null> {
    const data = await this.Course.findOne({ _id: categoryId });
    if (!data) return null;
    return data.isListed!;
  }

  public async getCourse(courseId: string): Promise<ICourse | null> {
    const data = await this.Course.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "trainerId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
                about: 1,
                profileImage: 1,
              },
            },
          ],
          as: "trainer",
        },
      },
      {
        $unwind: "$trainer",
      },
      {
        $lookup: {
          from: "modules",
          localField: "_id",
          foreignField: "courseId",
          pipeline: [
            {
              $lookup: {
                from: "lessons",
                localField: "_id",
                foreignField: "moduleId",
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      title: 1,
                      type: 1,
                    },
                  },
                ],
                as: "lessons",
              },
            },
            {
              $project: {
                _id: 1,
                title: 1,
                lessons: 1,
              },
            },
          ],
          as: "modules",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          pipeline: [
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
        $project: {
          trainerId: 0,
          categoryId: 0,
          isListed: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      },
    ]);

    return data[0];
  }

  public async getAdminCourseCount(search: RegExp): Promise<number> {
    return await this.Course.countDocuments({ title: search });
  }

  public async getTrainerCourse(courseId: string): Promise<ICourse | null> {
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
    },
    sortQuery: { createdAt?: -1; price?: -1 | 1; title?: -1 | 1 }
  ): Promise<Array<ICourse>> {
    return await this.Course.aggregate([
      {
        $match: {
          isListed: true,
          title: search,
          status: "approved",
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
        $project: {
          _id: 1,
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
      {
        $sort: sortQuery,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
  }

  public async getAdminCourses(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<ICourse>> {
    return await this.Course.find(
      { title: search },
      {
        _id: 1,
        title: 1,
        thumbnail: 1,
        categoryId: 1,
        trainerId: 1,
        price: 1,
        isListed: 1,
        difficulty: 1,
        status: 1,
      }
    )
      .populate("trainerId", "_id email")
      .populate("categoryId", "_id categoryName");
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
        status: 1,
      }
    )
      .skip(skip)
      .limit(limit)
      .populate("categoryId");
  }

  public async getCourseCount(search: RegExp): Promise<number> {
    return await this.Course.countDocuments({
      title: search,
      isListed: true,
      status: "approved",
    });
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
