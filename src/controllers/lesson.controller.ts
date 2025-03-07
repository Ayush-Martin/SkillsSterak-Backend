import { Request, Response, NextFunction } from "express";
import { ILessonService } from "../interfaces/services/ILesson.service";
import { addLessonValidator } from "../validators/lesson.validator";
import { unknown } from "zod";
import { Schema } from "mongoose";
import { StatusCodes } from "../utils/statusCodes";
import { successResponse } from "../utils/responseCreators";
import {
  GET_DATA_SUCCESS_MESSAGE,
  LESSON_ADDED_SUCCESS_MESSAGE,
  LESSON_DELETED_SUCCESS_MESSAGE,
} from "../constants/responseMessages";

class LessonController {
  constructor(private lessonService: ILessonService) {}

  public async addLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, moduleId } = req.params;
      const file = req.file;
      const { title, description, type } = addLessonValidator(req.body);

      if (!file) return;

      const data = await this.lessonService.createLesson({
        title,
        description,
        type,
        courseId: courseId as unknown as Schema.Types.ObjectId,
        moduleId: moduleId as unknown as Schema.Types.ObjectId,
        path: file.path,
      });

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(LESSON_ADDED_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }

  public async getLessons(req: Request, res: Response, next: NextFunction) {
    try {
      const { moduleId } = req.params;

      const data = await this.lessonService.getLessons(moduleId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }

  public async deleteLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { lessonId } = req.params;

      await this.lessonService.deleteLesson(lessonId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(LESSON_DELETED_SUCCESS_MESSAGE));
    } catch (err) {
      next(err);
    }
  }

  public async getLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { lessonId } = req.params;

      const lesson = await this.lessonService.getLesson(lessonId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, lesson));
    } catch (err) {
      next(err);
    }
  }
}

export default LessonController;
