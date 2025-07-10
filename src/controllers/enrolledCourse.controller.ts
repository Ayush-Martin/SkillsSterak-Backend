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

/**
 * Handles course enrollment, progress tracking, and lesson completion for users.
 * Delegates business logic to the enrolled courses service.
 */
class EnrolledCourses {
  constructor(
    private enrolledCoursesService: IEnrolledCoursesService,
    private chatService: IChatService
  ) {
    // Ensures 'this' context is preserved for all methods
    binder(this);
  }

  /**
   * Enrolls the authenticated user in a course and returns the order or enrollment result.
   */
  public async enrollCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const { method }: { method?: "wallet" | "stripe" } = req.body;
      const userId = req.userId!;
      const order = await this.enrolledCoursesService.enrollCourse(
        userId,
        courseId,
        method
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

  /**
   * Checks if the user is enrolled in a specific course.
   */
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

  /**
   * Returns all courses the user is enrolled in, paginated.
   */
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

  /**
   * Returns all completed courses for the user, paginated.
   */
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

  /**
   * Retrieves a specific enrolled course for the user.
   */
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

  /**
   * Marks a lesson as complete or incomplete for the user in a course.
   */
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

  /**
   * Returns the user's overall course completion progress (for dashboards, etc).
   */
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
