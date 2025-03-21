import { Request, Response, NextFunction } from "express";
import { ILessonService } from "../interfaces/services/ILesson.service";
import {
  addLessonValidator,
  updateLessonDetailsValidator,
} from "../validators/lesson.validator";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import {
  GET_DATA_SUCCESS_MESSAGE,
  LESSON_ADDED_SUCCESS_MESSAGE,
  LESSON_DELETED_SUCCESS_MESSAGE,
  LESSON_DETAILS_UPDATED_SUCCESS_MESSAGE,
  LESSON_FILE_UPDATED_SUCCESS_MESSAGE,
  LESSON_NO_FILE_ATTACHED_ERROR_MESSAGE,
} from "../constants/responseMessages";
import errorCreator from "../utils/customError";
import binder from "../utils/binder";
import { getObjectId } from "../utils/objectId";

class LessonController {
  constructor(private lessonService: ILessonService) {
    binder(this);
  }

  public async addLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, moduleId } = req.params;
      const file = req.file;
      const { title, description, type } = addLessonValidator(req.body);

      if (!file) {
        return errorCreator(
          LESSON_NO_FILE_ATTACHED_ERROR_MESSAGE,
          StatusCodes.BAD_REQUEST
        );
      }

      const data = await this.lessonService.createLesson({
        title,
        description,
        type,
        courseId: getObjectId(courseId),
        moduleId: getObjectId(moduleId),
        path: file.path,
      });

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(LESSON_ADDED_SUCCESS_MESSAGE, data));
    } catch (err) {
      console.log(err);
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

  public async updateLessonDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { lessonId } = req.params;
      const { title, description } = updateLessonDetailsValidator(req.body);

      const lesson = await this.lessonService.updateLesson(lessonId, {
        title,
        description,
      });

      res
        .status(StatusCodes.OK)
        .json(successResponse(LESSON_DETAILS_UPDATED_SUCCESS_MESSAGE, lesson));
    } catch (err) {
      next(err);
    }
  }

  public async updateLessonFile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { lessonId } = req.params;
      const file = req.file;

      if (!file) {
        return errorCreator(
          LESSON_NO_FILE_ATTACHED_ERROR_MESSAGE,
          StatusCodes.BAD_REQUEST
        );
      }

      const lesson = await this.lessonService.updateLesson(lessonId, {
        path: file.path,
        type: file.mimetype === "application/pdf" ? "pdf" : "video",
      });

      res
        .status(StatusCodes.OK)
        .json(successResponse(LESSON_FILE_UPDATED_SUCCESS_MESSAGE, lesson));
    } catch (err) {
      next(err);
    }
  }
}

export default LessonController;
