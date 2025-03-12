import { IReply } from "../../models/Reply.model";
import { IReview } from "../../models/Review.model";

export interface IReviewService {
  createReview(
    userId: string,
    courseId: string,
    rating: number,
    content: string
  ): Promise<IReview>;
  //   updateReview(reviewId: string, review: Partial<IReview>): Promise<IReview>;
  //   deleteReview(reviewId: string): Promise<void>;
  getReviews(courseId: string): Promise<Array<IReview>>;
  addReply(
    userId: string,
    reviewId: string,
    content: string
  ): Promise<IReply | null>;
  getReplies(reviewId: string): Promise<Array<IReply | null>>;
  deleteReview(reviewId: string): Promise<void>;
}
