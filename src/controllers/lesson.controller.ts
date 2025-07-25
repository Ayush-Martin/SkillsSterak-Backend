import { Request, Response, NextFunction } from "express";
import { ILessonService } from "../interfaces/services/ILesson.service";
import {
  addLessonValidator,
  updateLessonDetailsValidator,
} from "../validators/lesson.validator";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import errorCreator from "../utils/customError";
import binder from "../utils/binder";
import { getObjectId } from "../utils/objectId";
import { GeneralMessage, LessonMessage } from "../constants/responseMessages";

/**
 * Handles lesson creation, updates, and retrieval for modules.
 * All methods are bound for safe Express routing.
 */
class LessonController {
  constructor(private lessonService: ILessonService) {
    // Ensures 'this' context is preserved for all methods
    binder(this);
  }

  /**
   * Adds a new lesson to a module, requiring a file upload.
   * Returns an error if no file is provided to prevent incomplete lessons.
   */
  public async addLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, moduleId } = req.params;
      const file = req.file;
      const { title, description, type, duration } = addLessonValidator(
        req.body
      );

      if (!file) {
        return errorCreator(LessonMessage.NoFile, StatusCodes.BAD_REQUEST);
      }

      const data = await this.lessonService.createLesson({
        title,
        description,
        type,
        courseId: getObjectId(courseId),
        moduleId: getObjectId(moduleId),
        path: file.path,
        duration,
      });

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(LessonMessage.LessonAdded, data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves all lessons for a given module, supporting module content display.
   */
  public async getLessons(req: Request, res: Response, next: NextFunction) {
    try {
      const { moduleId } = req.params;

      const data = await this.lessonService.getLessons(moduleId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Deletes a lesson by its ID. Used for admin or trainer content management.
   */
  public async deleteLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { lessonId } = req.params;

      await this.lessonService.deleteLesson(lessonId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(LessonMessage.LessonDeleted));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves a single lesson by its ID for detail or preview views.
   */
  public async getLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { lessonId } = req.params;

      const lesson = await this.lessonService.getLesson(lessonId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, lesson));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Updates a lesson's title and description, supporting content corrections and improvements.
   */
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
        .json(successResponse(LessonMessage.LessonDetailsUpdated, lesson));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Updates the lesson's file (video/pdf). Returns an error if no file is provided to avoid broken content.
   */
  public async updateLessonFile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { lessonId } = req.params;
      const file = req.file;

      if (!file) {
        return errorCreator(LessonMessage.NoFile, StatusCodes.BAD_REQUEST);
      }

      const lesson = await this.lessonService.updateLesson(lessonId, {
        path: file.path,
        type: file.mimetype === "application/pdf" ? "pdf" : "video",
      });

      res
        .status(StatusCodes.OK)
        .json(successResponse(LessonMessage.LessonFileUpdated, lesson));
    } catch (err) {
      next(err);
    }
  }
}

export default LessonController;
