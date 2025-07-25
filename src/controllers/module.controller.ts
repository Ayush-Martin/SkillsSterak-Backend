import { Request, Response, NextFunction } from "express";
import { IModuleService } from "../interfaces/services/IModule.service";
import {
  addModuleValidator,
  editModuleTitleValidator,
} from "../validators/module.validator";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import binder from "../utils/binder";
import { getObjectId } from "../utils/objectId";
import { GeneralMessage, ModuleMessage } from "../constants/responseMessages";

/**
 * Handles module creation, updates, and retrieval for courses.
 * All methods are bound for safe Express routing.
 */
class ModuleController {
  constructor(private _moduleService: IModuleService) {
    // Ensures 'this' context is preserved for all methods
    binder(this);
  }

  /**
   * Adds a new module to a course, supporting course content structuring.
   */
  public async addModule(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const { title } = addModuleValidator(req.body);

      const module = await this._moduleService.createModule({
        courseId: getObjectId(courseId),
        title,
      });

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(ModuleMessage.ModuleAdded, module));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves all modules for a course, enabling module navigation and display.
   */
  public async getModules(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;

      const modules = await this._moduleService.getModules(courseId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, modules));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves a single module by its ID for detail or preview views.
   */
  public async getModule(req: Request, res: Response, next: NextFunction) {
    try {
      const { moduleId } = req.params;

      const module = await this._moduleService.getModule(moduleId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, module));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Deletes a module by its ID. Used for admin or trainer content management.
   */
  public async deleteModule(req: Request, res: Response, next: NextFunction) {
    try {
      const { moduleId } = req.params;

      await this._moduleService.deleteModule(moduleId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(ModuleMessage.ModuleDeleted));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Updates the title of a module, supporting content corrections and improvements.
   */
  public async updateTitle(req: Request, res: Response, next: NextFunction) {
    try {
      const { moduleId } = req.params;
      const { title } = editModuleTitleValidator(req.body);

      await this._moduleService.updateModuleTitle(moduleId, title);

      res
        .status(StatusCodes.OK)
        .json(successResponse(ModuleMessage.ModuleTitleChanged));
    } catch (err) {
      next(err);
    }
  }
}

export default ModuleController;
