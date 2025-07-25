import { Model } from "mongoose";
import { IReviewRepository } from "../interfaces/repositories/IReview.repository";
import { IReview } from "../models/Review.model";
import BaseRepository from "./Base.repository";

class ReviewRepository
  extends BaseRepository<IReview>
  implements IReviewRepository
{
  constructor(private _Review: Model<IReview>) {
    super(_Review);
  }

  public async getReviewsByCourseId(courseId: string): Promise<IReview[]> {
    return await this._Review.find({ courseId })
      .populate({
        path: "userId",
        select: "username profileImage",
      })
      .select("courseId rating content");
  }

  public async checkUserAddedReview(
    courseId: string,
    userId: string
  ): Promise<boolean> {
    const review = await this._Review.findOne({ userId, courseId });

    return !!review;
  }
}

export default ReviewRepository;
