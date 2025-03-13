import { IReply } from "../../models/Reply.model";
import { IReview } from "../../models/Review.model";

export interface IReviewService {
  /** Creates a new review */
  createReview(
    userId: string,
    courseId: string,
    rating: number,
    content: string
  ): Promise<IReview>;
  /** Gets reviews for a course */
  getReviews(courseId: string): Promise<Array<IReview>>;
  /** Adds a reply to a review */
  addReply(
    userId: string,
    reviewId: string,
    content: string
  ): Promise<IReply | null>;
  /** Gets replies for a review */
  getReplies(reviewId: string): Promise<Array<IReply | null>>;
  /** Deletes a review */
  deleteReview(reviewId: string): Promise<void>;
}
