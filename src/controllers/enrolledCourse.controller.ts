import { Request, Response, NextFunction } from "express";
import { IEnrolledCoursesService } from "../interfaces/services/IEnrolledCourses.service";
import { StatusCodes } from "../utils/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { GET_DATA_SUCCESS_MESSAGE } from "../constants/responseMessages";

class EnrolledCourses {
  constructor(private enrolledCoursesService: IEnrolledCoursesService) {}

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
        .json(successResponse(order ? "order created" : "enrolled", order));
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
      const { orderId } = req.body;
      console.log(orderId, req.body);
      await this.enrolledCoursesService.completePurchase(orderId);
      res
        .status(StatusCodes.OK)
        .json(successResponse("order completed successfully")); // TODO: change message
    } catch (error) {
      next(error);
    }
  }

  public async checkEnrolled(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const userId = req.userId!;
      await this.enrolledCoursesService.checkEnrolled(userId, courseId);
      res
        .status(StatusCodes.OK)
        .json(successResponse("You can access this course"));
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
      const page = parseInt(req.query.page as string) || 1;

      const enrolledCourses =
        await this.enrolledCoursesService.getEnrolledCourses(userId, page);

      res.status(StatusCodes.OK).json(successResponse("Data", enrolledCourses));
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

      const enrolledCourse=await this.enrolledCoursesService.completeUnCompleteLesson(
        userId,
        courseId,
        lessonId
      );

      res.status(StatusCodes.OK).json(successResponse("changed",enrolledCourse));
    } catch (err) {
      next(err);
    }
  }
}

export default EnrolledCourses;
