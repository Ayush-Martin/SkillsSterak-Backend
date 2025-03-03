import { Request, Response, NextFunction } from "express";
import { ICourseService } from "../interfaces/services/ICourse.service";
import {
  createCourseValidator,
  getCoursesValidator,
  updateCourseBasicDetailsValidator,
  updateCourseRequirementsValidator,
  updateCourseSkillsCoveredValidator,
} from "../validators/course.validator";
import { StatusCodes } from "../utils/statusCodes";
import { successResponse } from "../utils/responseCreators";
import {
  COURSE_CREATED_SUCCESS_MESSAGE,
  COURSE_THUMBNAIL_CHANGE_SUCCESS_MESSAGE,
  GET_DATA_SUCCESS_MESSAGE,
  UPDATED_COURSE_BASIC_DETAILS_SUCCESS_MESSAGE,
  UPDATED_COURSE_REQUIREMENTS_SUCCESS_MESSAGE,
  UPDATED_COURSE_SKILLS_COVERED_SUCCESS_MESSAGE,
} from "../constants/responseMessages";
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

  public async getCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;

      const course = await this.courseService.getCourse(courseId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, course));
    } catch (err) {
      next(err);
    }
  }

  public async getTrainerCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, search } = getCoursesValidator(req.query);
      const trainerId = req.userId!;

      const data = await this.courseService.getTrainerCourses(
        trainerId,
        search,
        page
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }

  public async changeCourseThumbnail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const thumbnail = req.file;

      if (!thumbnail) return;

      await this.courseService.changeCourseThumbnail(courseId, thumbnail.path);

      res
        .status(StatusCodes.OK)
        .json(
          successResponse(
            COURSE_THUMBNAIL_CHANGE_SUCCESS_MESSAGE,
            thumbnail.path
          )
        );
    } catch (err) {
      next(err);
    }
  }

  public async updateCourseBasicDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const data = updateCourseBasicDetailsValidator(req.body);

      await this.courseService.updateCourse(courseId, data);

      res
        .status(StatusCodes.OK)
        .json(successResponse(UPDATED_COURSE_BASIC_DETAILS_SUCCESS_MESSAGE));
    } catch (err) {
      next(err);
    }
  }

  public async updateCourseRequirements(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const data = updateCourseRequirementsValidator(req.body);

      await this.courseService.updateCourse(courseId, data);

      res
        .status(StatusCodes.OK)
        .json(successResponse(UPDATED_COURSE_REQUIREMENTS_SUCCESS_MESSAGE));
    } catch (err) {
      next(err);
    }
  }

  public async updateCourseSkillsCovered(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const data = updateCourseSkillsCoveredValidator(req.body);

      await this.courseService.updateCourse(courseId, data);

      res
        .status(StatusCodes.OK)
        .json(successResponse(UPDATED_COURSE_SKILLS_COVERED_SUCCESS_MESSAGE));
    } catch (err) {
      next(err);
    }
  }
}

export default CourseController;
