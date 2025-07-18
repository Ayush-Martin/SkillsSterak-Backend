import { IUser } from "../models/User.model";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import mongoose, { Model } from "mongoose";
import BaseRepository from "./Base.repository";

class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor(private User: Model<IUser>) {
    super(User);
  }

  public async getAdmin(): Promise<IUser | null> {
    return await this.User.findOne({ role: "admin" });
  }

  public async getUsers(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<IUser>> {
    return await this.User.find(
      { email: search, role: { $ne: "admin" } },
      { username: 1, email: 1, isBlocked: 1, role: 1, profileImage: 1 }
    )
      .skip(skip)
      .limit(limit);
  }

  public async getUserEmail(userId: string): Promise<string | undefined> {
    const user = await this.User.findById(userId, { email: 1 });

    return user?.email;
  }

  public async getUserByEmail(email: string): Promise<IUser | null> {
    return await this.User.findOne({ email });
  }

  public async getUserByGoogleId(googleId: string): Promise<IUser | null> {
    return await this.User.findOne({ googleId });
  }

  public async getUserBlockStatus(
    userId: string
  ): Promise<{ isBlocked: boolean } | null> {
    return await this.User.findById(userId, { _id: 0, isBlocked: 1 });
  }

  public async getUsersCount(search: RegExp): Promise<number> {
    return await this.User.countDocuments({
      email: search,
      role: { $ne: "admin" },
    });
  }

  public async updatePassword(
    userId: string,
    password: string
  ): Promise<IUser | null> {
    return await this.User.findByIdAndUpdate(
      userId,
      { password: password },
      { new: true }
    );
  }

  public async updateUser(
    userId: string,
    user: Partial<IUser>
  ): Promise<IUser | null> {
    return await this.User.findByIdAndUpdate(userId, user, { new: true });
  }

  public async updateProfileImage(
    userId: string,
    profileImage: string
  ): Promise<IUser | null> {
    return await this.User.findByIdAndUpdate(
      userId,
      { profileImage },
      { new: true }
    );
  }

  public async changeBlockStatus(
    userId: string,
    status: boolean
  ): Promise<IUser | null> {
    return await this.User.findByIdAndUpdate(userId, { isBlocked: status });
  }

  public async changePremiumStatus(
    userId: string,
    status: boolean
  ): Promise<IUser | null> {
    return await this.User.findByIdAndUpdate(userId, { isPremium: status });
  }

  public async updateStripeAccountId(
    userId: string,
    stripeAccountId: string
  ): Promise<IUser | null> {
    return await this.User.findByIdAndUpdate(userId, { stripeAccountId });
  }

  public async getUserProfileDetails(userId: string): Promise<IUser | null> {
    const user = await this.User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
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
                      averageRating: {
                        $avg: "$rating",
                      },
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
                averageRating: 1,
                _id: 1,
                trainerId: 1,
                title: 1,
                price: 1,
                difficulty: 1,
                thumbnail: 1,
                category: "$category.categoryName",
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
          username: 1,
          email: 1,
          profileImage: 1,
          bio: 1,
          role: 1,
          company: 1,
          location: 1,
          socialLinks: 1,
          skills: 1,
          experiences: 1,
          courses: 1,
        },
      },
    ]);

    return user[0];
  }
}

export default UserRepository;
