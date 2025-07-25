import { IReviewRepository } from "../interfaces/repositories/IReview.repository";
import { IReviewService } from "../interfaces/services/IReview.service";
import { IReview } from "../models/Review.model";
import { IReplyRepository } from "../interfaces/repositories/IReply.repository";
import { IReply } from "../models/Reply.model";
import { getObjectId } from "../utils/objectId";
import errorCreator from "../utils/customError";
import { ReviewMessage } from "../constants/responseMessages";
import { StatusCodes } from "../constants/statusCodes";
import { IEnrolledCoursesRepository } from "../interfaces/repositories/IEnrolledCourses.repository";

class ReviewService implements IReviewService {
  constructor(
    private _reviewRepository: IReviewRepository,
    private _replyRepository: IReplyRepository,
    private _enrolledCourseRepository: IEnrolledCoursesRepository
  ) {}

  public async createReview(
    userId: string,
    courseId: string,
    rating: number,
    content: string
  ): Promise<IReview> {
    const reviewedAlready = await this._reviewRepository.checkUserAddedReview(
      courseId,
      userId
    );

    if (reviewedAlready) {
      errorCreator(ReviewMessage.ReviewedAlready, StatusCodes.BAD_REQUEST);
    }

    const isUserEnrolled = await this._enrolledCourseRepository.checkEnrolled(
      userId,
      courseId
    );

    if (!isUserEnrolled) {
      errorCreator(ReviewMessage.NotEnrolledCourse, StatusCodes.FORBIDDEN);
    }

    return await this._reviewRepository.create({
      userId: getObjectId(userId),
      courseId: getObjectId(courseId),
      rating,
      content,
    });
  }

  public async getReviews(courseId: string): Promise<Array<IReview>> {
    return await this._reviewRepository.getReviewsByCourseId(courseId);
  }

  public async addReply(
    userId: string,
    reviewId: string,
    content: string
  ): Promise<IReply | null> {
    return await this._replyRepository.create({
      userId: getObjectId(userId),
      entityId: getObjectId(reviewId),
      content,
    });
  }

  public async getReplies(reviewId: string): Promise<Array<IReply | null>> {
    return await this._replyRepository.getReplies(reviewId);
  }

  public async deleteReview(reviewId: string): Promise<void> {
    await this._reviewRepository.deleteById(reviewId);
    await this._replyRepository.deleteByEntityId(reviewId);
  }

  public async updateReview(
    reviewId: string,
    rating: number,
    content: string
  ): Promise<void> {
    await this._reviewRepository.updateById(reviewId, { rating, content });
  }
}

export default ReviewService;
