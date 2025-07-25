import { Request, Response, NextFunction } from "express";
import { IReviewService } from "../interfaces/services/IReview.service";
import {
  addReplyValidator,
  addReviewValidator,
  updateReviewValidator,
} from "../validators/review.validator";
import { successResponse } from "../utils/responseCreators";
import { StatusCodes } from "../constants/statusCodes";
import binder from "../utils/binder";
import { GeneralMessage, ReviewMessage } from "../constants/responseMessages";

/**
 * Handles course reviews and replies, enabling user feedback and discussion.
 * All methods are bound for safe Express routing.
 */
class ReviewController {
  constructor(private _reviewService: IReviewService) {
    // Ensures 'this' context is preserved for all methods
    binder(this);
  }
  /**
   * Adds a review to a course, supporting user feedback and ratings.
   */
  public async addReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { courseId } = req.params;
      const { content, rating } = addReviewValidator(req.body);
      const review = await this._reviewService.createReview(
        userId,
        courseId,
        rating,
        content
      );

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(ReviewMessage.ReviewAdded, review));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves all reviews for a course, enabling review display and aggregation.
   */
  public async getReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;

      const reviews = await this._reviewService.getReviews(courseId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, reviews));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Adds a reply to a review, supporting threaded discussions and clarifications.
   */
  public async addReply(req: Request, res: Response, next: NextFunction) {
    try {
      const { reviewId } = req.params;
      const userId = req.userId!;
      const { content } = addReplyValidator(req.body);

      const reply = await this._reviewService.addReply(
        userId,
        reviewId,
        content
      );

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(ReviewMessage.ReplyAdded, reply));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves all replies for a review, enabling nested feedback and conversation.
   */
  public async getReplies(req: Request, res: Response, next: NextFunction) {
    try {
      const { reviewId } = req.params;

      const replies = await this._reviewService.getReplies(reviewId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, replies));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Deletes a review by its ID. Used for moderation or user content management.
   */
  public async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { reviewId } = req.params;

      await this._reviewService.deleteReview(reviewId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(ReviewMessage.ReviewDeleted));
    } catch (err) {
      next(err);
    }
  }

  
  public async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { reviewId } = req.params;
      const { content, rating } = updateReviewValidator(req.body);

      await this._reviewService.updateReview(reviewId, rating, content);

      res
        .status(StatusCodes.OK)
        .json(successResponse(ReviewMessage.ReviewUpdated));
    } catch (err) {
      next(err);
    }
  }
}

export default ReviewController;
