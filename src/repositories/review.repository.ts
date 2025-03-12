import { Model } from "mongoose";
import { IReviewRepository } from "../interfaces/repositories/IReview.repository";
import { IReview } from "../models/Review.model";
import BaseRepository from "./Base.repository";

class ReviewRepository
  extends BaseRepository<IReview>
  implements IReviewRepository
{
  constructor(private Review: Model<IReview>) {
    super(Review);
  }

  public async getReviewsByCourseId(courseId: string): Promise<IReview[]> {
    return this.Review.find({ courseId })
      .populate({
        path: "userId",
        select: "username profileImage",
      })
      .select("courseId rating content");
  }
}

export default ReviewRepository;
