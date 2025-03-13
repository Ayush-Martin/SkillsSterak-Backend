import { IReviewRepository } from "../interfaces/repositories/IReview.repository";
import { IReviewService } from "../interfaces/services/IReview.service";
import { IReview } from "../models/Review.model";
import { IReplyRepository } from "../interfaces/repositories/IReply.repository";
import { IReply } from "../models/Reply.model";
import { getObjectId } from "../utils/objectId";

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
      userId: getObjectId(userId),
      courseId: getObjectId(courseId),
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
      userId: getObjectId(userId),
      entityId: getObjectId(reviewId),
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
