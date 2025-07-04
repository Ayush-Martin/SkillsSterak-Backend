import mongoose, { Model, Mongoose } from "mongoose";
import { IWishlistRepository } from "../interfaces/repositories/IWishlist.repository";
import { IWishlist } from "../models/Wishlist.model";
import BaseRepository from "./Base.repository";

class WishlistRepository
  extends BaseRepository<IWishlist>
  implements IWishlistRepository
{
  constructor(private Wishlist: Model<IWishlist>) {
    super(Wishlist);
  }

  public async getUserWishlist(userId: string): Promise<Array<IWishlist>> {
    console.log(userId);
    return await this.Wishlist.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                title: 1,
                thumbnail: 1,
                price: 1,
                _id: 1,
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
          course: 1,
          _id: 1,
        },
      },
    ]);
  }

  public async removeCourseFromWishlist(
    userId: string,
    courseId: string
  ): Promise<void> {
    await this.Wishlist.deleteOne({ userId, courseId });
  }

  public async checkCourseAdded(
    userId: string,
    courseId: string
  ): Promise<boolean> {
    const wishlist = await this.Wishlist.findOne({ userId, courseId });

    return !!wishlist;
  }
}

export default WishlistRepository;
