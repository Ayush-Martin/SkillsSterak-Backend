import { IReply } from "../../models/Reply.model";
import { IReview } from "../../models/Review.model";

export interface IReviewService {
  /**
   * Persists a new review for a course. Used to collect user feedback and ratings for quality assurance and social proof.
   */
  createReview(
    userId: string,
    courseId: string,
    rating: number,
    content: string
  ): Promise<IReview>;

  /**
   * Retrieves all reviews for a specific course. Used to display feedback and help users make informed decisions.
   */
  getReviews(courseId: string): Promise<Array<IReview>>;

  /**
   * Adds a reply to a review. Used for instructor or user engagement and to address feedback.
   */
  addReply(
    userId: string,
    reviewId: string,
    content: string
  ): Promise<IReply | null>;

  /**
   * Retrieves all replies for a given review. Used to display discussion threads and foster community interaction.
   */
  getReplies(reviewId: string): Promise<Array<IReply | null>>;

  /**
   * Removes a review from the system. Used for moderation, user requests, or content management.
   */
  deleteReview(reviewId: string): Promise<void>;
}
