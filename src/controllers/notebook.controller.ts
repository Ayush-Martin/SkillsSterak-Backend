import { Request, Response, NextFunction } from "express";
import { INotebookService } from "../interfaces/services/INotebook.service";
import binder from "../utils/binder";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { GeneralMessage, NotebookMessage } from "../constants/responseMessages";
import {
  addNoteBookValidator,
  updateNoteBookValidator,
} from "../validators/notebook.validator";

/**
 * Handles notebook creation, retrieval, update, and deletion for course notes.
 * All methods are bound for safe Express routing.
 */
class NotebookController {
  constructor(private _notebookService: INotebookService) {
    // Ensures 'this' context is preserved for all methods
    binder(this);
  }

  /**
   * Retrieves all notebooks for a user in a specific course, supporting course note features.
   */
  public async getCourseNotebooks(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const { courseId } = req.params;

      const data = await this._notebookService.getCourseNotebooks(
        userId,
        courseId
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Adds a new notebook for a user in a course. Returns the created notebook's details.
   */
  public async addNotebook(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { courseId } = req.params;
      const { title } = addNoteBookValidator(req.body);

      const data = await this._notebookService.addNoteBook(
        userId,
        courseId,
        title
      );

      res.status(StatusCodes.CREATED).json(
        successResponse(NotebookMessage.NotebookAdded, {
          _id: data.id,
          title: data.title,
          notes: data.notes,
        })
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * Deletes a notebook by its ID. Used for user note management.
   */
  public async deleteNotebook(req: Request, res: Response, next: NextFunction) {
    try {
      const { notebookId } = req.params;

      await this._notebookService.deleteNoteBook(notebookId);

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(NotebookMessage.NotebookDeleted));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Updates the title and notes of a notebook, supporting note editing and corrections.
   */
  public async updateNotebook(req: Request, res: Response, next: NextFunction) {
    try {
      const { notebookId } = req.params;
      const { title, notes } = updateNoteBookValidator(req.body);

      const data = await this._notebookService.updateNoteBook(
        notebookId,
        title,
        notes
      );

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(NotebookMessage.NotebookUpdated, data));
    } catch (err) {
      next(err);
    }
  }
}

export default NotebookController;
