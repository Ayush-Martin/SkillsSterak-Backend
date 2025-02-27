import { Request, Response, NextFunction } from "express";
import { ICourseService } from "../interfaces/services/ICourse.service";
import { createCourseValidator } from "../validators/course.validator";
import { StatusCodes } from "../utils/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { COURSE_CREATED_SUCCESS_MESSAGE } from "../constants/responseMessages";
import { unknown } from "zod";
import mongoose from "mongoose";

class CourseController {
  constructor(private courseService: ICourseService) {}

  public async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const trainerId =
        req.userId! as unknown as mongoose.Schema.Types.ObjectId;
      const thumbnail = req.file;
      const courseData = createCourseValidator(req.body);

      if (!thumbnail) return;

      const course = await this.courseService.createCourse({
        ...courseData,
        trainerId,
        thumbnail: thumbnail.path,
      });

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(COURSE_CREATED_SUCCESS_MESSAGE, course));
    } catch (err) {
      next(err);
    }
  }
}

export default CourseController;
