import mongoose, { mongo } from "mongoose";
import { IReviewRepository } from "../interfaces/repositories/IReview.repository";
import { IReviewService } from "../interfaces/services/IReview.service";
import { IReview } from "../models/Review.model";
import { IReplyRepository } from "../interfaces/repositories/IReply.repository";
import { IReply } from "../models/Reply.model";

class ReviewService implements IReviewService {
  constructor(
    private reviewRepository: IReviewRepository,
    private replyRepository: IReplyRepository
  ) {}

  public async createReview(
    userId: string,
    courseId: string,
    rating: number,
    content: string
  ): Promise<IReview> {
    return await this.reviewRepository.create({
      userId: userId as unknown as mongoose.Schema.Types.ObjectId,
      courseId: courseId as unknown as mongoose.Schema.Types.ObjectId,
      rating,
      content,
    });
  }

  public async getReviews(courseId: string): Promise<Array<IReview>> {
    return await this.reviewRepository.getReviewsByCourseId(courseId);
  }

  public async addReply(
    userId: string,
    reviewId: string,
    content: string
  ): Promise<IReply | null> {
    return await this.replyRepository.create({
      userId: userId as unknown as mongoose.Schema.Types.ObjectId,
      entityId: reviewId as unknown as mongoose.Schema.Types.ObjectId,
      content,
    });
  }

  public async getReplies(reviewId: string): Promise<Array<IReply | null>> {
    return await this.replyRepository.getReviewReplies(reviewId);
  }

  public async deleteReview(reviewId: string): Promise<void> {
    await this.reviewRepository.deleteById(reviewId);
    await this.replyRepository.deleteByEntityId(reviewId);
  }
}

export default ReviewService;
