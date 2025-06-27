import { Request, Response, NextFunction } from "express";
import { INotebookService } from "../interfaces/services/INotebook.service";
import binder from "../utils/binder";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";

class NotebookController {
  constructor(private notebookService: INotebookService) {
    binder(this);
  }

  public async getCourseNotebooks(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const { courseId } = req.params;

      const data = await this.notebookService.getCourseNotebooks(
        userId,
        courseId
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse("course data returned", data));
    } catch (err) {
      next(err);
    }
  }

  public async addNotebook(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { courseId } = req.params;
      const { title }: { title: string } = req.body;

      const data = await this.notebookService.addNoteBook(
        userId,
        courseId,
        title
      );

      res.status(StatusCodes.CREATED).json(
        successResponse("new notebook created", {
          _id: data.id,
          title: data.title,
          notes: data.notes,
        })
      );
    } catch (err) {
      next(err);
    }
  }

  public async deleteNotebook(req: Request, res: Response, next: NextFunction) {
    try {
      const { notebookId } = req.params;

      await this.notebookService.deleteNoteBook(notebookId);

      res.status(StatusCodes.CREATED).json(successResponse("notebook deleted"));
    } catch (err) {
      next(err);
    }
  }

  public async updateNotebook(req: Request, res: Response, next: NextFunction) {
    try {
      const { notebookId } = req.params;
      const { title, notes }: { title: string; notes: string[] } = req.body;

      const data = await this.notebookService.updateNoteBook(
        notebookId,
        title,
        notes
      );

      res
        .status(StatusCodes.CREATED)
        .json(successResponse("notebook deleted", data));
    } catch (err) {
      next(err);
    }
  }
}

export default NotebookController;
