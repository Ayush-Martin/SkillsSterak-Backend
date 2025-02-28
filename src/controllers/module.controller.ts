import { Request, Response, NextFunction } from "express";
import { IModuleService } from "../interfaces/services/IModule.service";
import {
  addModuleValidator,
  editModuleTitleValidator,
} from "../validators/module.validator";
import mongoose from "mongoose";
import { StatusCodes } from "../utils/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { GET_DATA_SUCCESS_MESSAGE } from "../constants/responseMessages";

class ModuleController {
  constructor(private moduleService: IModuleService) {}

  public async addModule(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const { title } = addModuleValidator(req.body);

      const module = await this.moduleService.createModule({
        courseId: courseId as unknown as mongoose.Schema.Types.ObjectId,
        title,
      });

      res
        .status(StatusCodes.CREATED)
        .json(successResponse("new module added", module));
    } catch (err) {
      next(err);
    }
  }

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

  public async deleteModule(req: Request, res: Response, next: NextFunction) {
    try {
      const { moduleId } = req.params;

      await this.moduleService.deleteModule(moduleId);

      res.status(StatusCodes.OK).json(successResponse("module deleted"));
    } catch (err) {
      next(err);
    }
  }

  public async updateTitle(req: Request, res: Response, next: NextFunction) {
    try {
      const { moduleId } = req.params;
      const { title } = editModuleTitleValidator(req.body);

      await this.moduleService.updateModuleTitle(moduleId, title);

      res.status(StatusCodes.OK).json(successResponse("title changed"));
    } catch (err) {
      next(err);
    }
  }
}

export default ModuleController;
