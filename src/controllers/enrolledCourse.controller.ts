import { Request, Response, NextFunction } from "express";
import { IEnrolledCoursesService } from "../interfaces/services/IEnrolledCourses.service";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import binder from "../utils/binder";
import { pageValidator } from "../validators/pagination.validator";
import { getObjectId } from "../utils/objectId";
import { IChatService } from "../interfaces/services/IChat.service";
import {
  CourseMessage,
  GeneralMessage,
  LessonMessage,
} from "../constants/responseMessages";

/** EnrolledCourses controller: manages course enrollment and progress */
class EnrolledCourses {
  /** Injects enrolled courses and chat services */
  constructor(
    private enrolledCoursesService: IEnrolledCoursesService,
    private chatService: IChatService
  ) {
    binder(this);
  }

  /** Enroll a user in a course */
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
              ? CourseMessage.CourseOrderCreated
              : CourseMessage.CourseEnrolled,
            order
          )
        );
    } catch (error) {
      next(error);
    }
  }

  /** Check if user is enrolled in a course */
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
        .json(successResponse(GeneralMessage.DataReturned, access));
    } catch (err) {
      next(err);
    }
  }

  /** Get all enrolled courses for a user */
  public async getEnrolledCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const { page, size } = pageValidator(req.query);

      const enrolledCourses =
        await this.enrolledCoursesService.getEnrolledCourses(
          userId,
          page,
          size
        );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, enrolledCourses));
    } catch (err) {
      next(err);
    }
  }

  /** Get all completed enrolled courses for a user */
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
        .json(successResponse(GeneralMessage.DataReturned, enrolledCourses));
    } catch (err) {
      next(err);
    }
  }

  /** Get a specific enrolled course for a user */
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
        .json(successResponse(GeneralMessage.DataReturned, enrolledCourse));
    } catch (err) {
      next(err);
    }
  }

  /** Mark lesson as complete or incomplete */
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
              ? LessonMessage.LessonCompleted
              : LessonMessage.LessonNotCompleted,
            enrolledCourse
          )
        );
    } catch (err) {
      next(err);
    }
  }

  public async getCompletionProgress(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const progress = await this.enrolledCoursesService.getCompletionProgress(
        userId
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, progress));
    } catch (err) {
      next(err);
    }
  }
}

export default EnrolledCourses;
