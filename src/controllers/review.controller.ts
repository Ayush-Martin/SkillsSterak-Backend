import { Request, Response, NextFunction } from "express";
import { IReviewService } from "../interfaces/services/IReview.service";
import {
  addReplyValidator,
  addReviewValidator,
} from "../validators/review.validator";
import { successResponse } from "../utils/responseCreators";
import { StatusCodes } from "../constants/statusCodes";
import {
  GET_DATA_SUCCESS_MESSAGE,
  REPLY_ADDED_SUCCESS_MESSAGE,
  REVIEW_ADDED_SUCCESS_MESSAGE,
  REVIEW_DELETE_SUCCESS_MESSAGE,
} from "../constants/responseMessages";
import binder from "../utils/binder";

class ReviewController {
  constructor(private reviewService: IReviewService) {
    binder(this);
  }
  public async addReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { courseId } = req.params;
      const { content, rating } = addReviewValidator(req.body);
      const review = await this.reviewService.createReview(
        userId,
        courseId,
        rating,
        content
      );

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(REVIEW_ADDED_SUCCESS_MESSAGE, review));
    } catch (err) {
      next(err);
    }
  }

  public async getReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;

      const reviews = await this.reviewService.getReviews(courseId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, reviews));
    } catch (err) {
      next(err);
    }
  }

  public async addReply(req: Request, res: Response, next: NextFunction) {
    try {
      const { reviewId } = req.params;
      const userId = req.userId!;
      const { content } = addReplyValidator(req.body);

      const reply = await this.reviewService.addReply(
        userId,
        reviewId,
        content
      );

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(REPLY_ADDED_SUCCESS_MESSAGE, reply));
    } catch (err) {
      next(err);
    }
  }

  public async getReplies(req: Request, res: Response, next: NextFunction) {
    try {
      const { reviewId } = req.params;

      const replies = await this.reviewService.getReplies(reviewId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, replies));
    } catch (err) {
      next(err);
    }
  }

  public async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { reviewId } = req.params;

      await this.reviewService.deleteReview(reviewId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(REVIEW_DELETE_SUCCESS_MESSAGE));
    } catch (err) {
      next(err);
    }
  }
}

export default ReviewController;
