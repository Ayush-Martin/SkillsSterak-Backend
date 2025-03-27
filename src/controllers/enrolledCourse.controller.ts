import { Request, Response, NextFunction } from "express";
import { IEnrolledCoursesService } from "../interfaces/services/IEnrolledCourses.service";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import {
  COURSE_ACCESS_SUCCESS_MESSAGE,
  COURSE_ENROLLED_SUCCESS_MESSAGE,
  COURSE_ORDER_CREATED_SUCCESS_MESSAGE,
  GET_DATA_SUCCESS_MESSAGE,
  LESSON_COMPLETED_SUCCESS_MESSAGE,
  LESSON_NOT_COMPLETED_SUCCESS_MESSAGE,
} from "../constants/responseMessages";
import binder from "../utils/binder";
import {
  pageValidator,
  razorpayCompletePurchaseValidator,
} from "../validators/index.validator";
import { getObjectId } from "../utils/objectId";

class EnrolledCourses {
  constructor(private enrolledCoursesService: IEnrolledCoursesService) {
    binder(this);
  }

  public async enrollCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const userId = req.userId!;
      const order = await this.enrolledCoursesService.enrollCourse(
        userId,
        courseId
      );
      res
        .status(StatusCodes.CREATED)
        .json(
          successResponse(
            order
              ? COURSE_ORDER_CREATED_SUCCESS_MESSAGE
              : COURSE_ENROLLED_SUCCESS_MESSAGE,
            order
          )
        );
    } catch (error) {
      next(error);
    }
  }

  public async completePurchase(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { orderId } = razorpayCompletePurchaseValidator(req.body);
      await this.enrolledCoursesService.completePurchase(orderId);
      res
        .status(StatusCodes.OK)
        .json(successResponse(COURSE_ENROLLED_SUCCESS_MESSAGE));
    } catch (error) {
      next(error);
    }
  }

  public async checkEnrolled(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const userId = req.userId!;
      const access = await this.enrolledCoursesService.checkEnrolled(
        userId,
        courseId
      );
      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, access));
    } catch (err) {
      next(err);
    }
  }

  public async getEnrolledCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const { page } = pageValidator(req.query);

      const enrolledCourses =
        await this.enrolledCoursesService.getEnrolledCourses(userId, page);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, enrolledCourses));
    } catch (err) {
      next(err);
    }
  }

  public async getCompletedEnrolledCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const { page } = pageValidator(req.query);

      const enrolledCourses =
        await this.enrolledCoursesService.getCompletedEnrolledCourses(
          userId,
          page
        );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, enrolledCourses));
    } catch (err) {
      next(err);
    }
  }

  public async getEnrolledCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const { courseId } = req.params;

      const enrolledCourse =
        await this.enrolledCoursesService.getEnrolledCourse(userId, courseId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, enrolledCourse));
    } catch (err) {
      next(err);
    }
  }

  public async completeUnCompleteLesson(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;

      const { courseId, lessonId } = req.params;

      const enrolledCourse =
        await this.enrolledCoursesService.completeUnCompleteLesson(
          userId,
          courseId,
          lessonId
        );

      res
        .status(StatusCodes.OK)
        .json(
          successResponse(
            enrolledCourse?.completedLessons?.includes(getObjectId(lessonId))
              ? LESSON_COMPLETED_SUCCESS_MESSAGE
              : LESSON_NOT_COMPLETED_SUCCESS_MESSAGE,
            enrolledCourse
          )
        );
    } catch (err) {
      next(err);
    }
  }
}

export default EnrolledCourses;
