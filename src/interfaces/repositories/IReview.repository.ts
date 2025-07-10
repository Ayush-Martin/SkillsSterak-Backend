import { IReview } from "../../models/Review.model";
import { IBaseRepository } from "./IBase.repository";

/**
 * Repository interface for review-related data operations.
 * Supports course feedback, rating aggregation, and review retrieval.
 */
export interface IReviewRepository extends IBaseRepository<IReview> {
  /**
   * Retrieves all reviews for a specific course.
   * Enables course rating displays and user feedback features.
   */
  getReviewsByCourseId(courseId: string): Promise<IReview[]>;

  checkUserAddedReview(courseId: string, userId: string): Promise<boolean>;
}
