import { Request, Response, NextFunction } from "express";
import { IModuleService } from "../interfaces/services/IModule.service";
import {
  addModuleValidator,
  editModuleTitleValidator,
} from "../validators/module.validator";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import {
  GET_DATA_SUCCESS_MESSAGE,
  MODULE_ADDED_SUCCESS_MESSAGE,
  MODULE_DELETED_SUCCESS_MESSAGE,
  MODULE_TITLE_CHANGED_SUCCESS_MESSAGE,
} from "../constants/responseMessages";
import binder from "../utils/binder";
import { getObjectId } from "../utils/objectId";

/** Module controller: manages module creation, updates, and queries */
class ModuleController {
  /** Injects module service */
  constructor(private moduleService: IModuleService) {
    binder(this);
  }

  /** Add a new module to a course */
  public async addModule(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const { title } = addModuleValidator(req.body);

      const module = await this.moduleService.createModule({
        courseId: getObjectId(courseId),
        title,
      });

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(MODULE_ADDED_SUCCESS_MESSAGE, module));
    } catch (err) {
      next(err);
    }
  }

  /** Get all modules for a course */
  public async getModules(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;

      const modules = await this.moduleService.getModules(courseId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, modules));
    } catch (err) {
      next(err);
    }
  }

  /** Get a single module by ID */
  public async getModule(req: Request, res: Response, next: NextFunction) {
    try {
      const { moduleId } = req.params;

      const module = await this.moduleService.getModule(moduleId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, module));
    } catch (err) {
      next(err);
    }
  }

  /** Delete a module by ID */
  public async deleteModule(req: Request, res: Response, next: NextFunction) {
    try {
      const { moduleId } = req.params;

      await this.moduleService.deleteModule(moduleId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(MODULE_DELETED_SUCCESS_MESSAGE));
    } catch (err) {
      next(err);
    }
  }

  /** Update module title */
  public async updateTitle(req: Request, res: Response, next: NextFunction) {
    try {
      const { moduleId } = req.params;
      const { title } = editModuleTitleValidator(req.body);

      await this.moduleService.updateModuleTitle(moduleId, title);

      res
        .status(StatusCodes.OK)
        .json(successResponse(MODULE_TITLE_CHANGED_SUCCESS_MESSAGE));
    } catch (err) {
      next(err);
    }
  }
}

export default ModuleController;
