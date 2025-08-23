import { NextFunction, Request, Response } from "express";
import { ICategoryService } from "../interfaces/services/ICategory.service";
import {
  addCategoryValidator,
  editCategoryValidator,
} from "../validators/category.validator";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import binder from "../utils/binder";
import { paginatedGetDataValidator } from "../validators/pagination.validator";
import { CategoryMessage, GeneralMessage } from "../constants/responseMessages";


class CategoryController {
  constructor(private _categoryService: ICategoryService) {
    binder(this);
  }


  public async addCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryName } = addCategoryValidator(req.body);

      const category = await this._categoryService.addCategory(categoryName);

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(CategoryMessage.CategoryAdded, category));
    } catch (err) {
      next(err);
    }
  }


  public async editCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.params;

      const { categoryName } = editCategoryValidator(req.body);

      const category = await this._categoryService.editCategoryName(
        categoryId,
        categoryName
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(CategoryMessage.CategoryUpdated, category));
    } catch (err) {
      next(err);
    }
  }

  public async listUnListCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { categoryId } = req.params;

      const isListed = await this._categoryService.listUnListCategory(
        categoryId
      );

      res
        .status(StatusCodes.OK)
        .json(
          successResponse(
            isListed
              ? CategoryMessage.CategoryListed
              : CategoryMessage.CategoryUnlisted,
            { categoryId, isListed }
          )
        );
    } catch (err) {
      next(err);
    }
  }

  public async getAllCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const categories = await this._categoryService.getAllCategories();

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, categories));
    } catch (err) {
      next(err);
    }
  }

  public async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, search, size } = paginatedGetDataValidator(req.query);

      const data = await this._categoryService.getCategories(search, page, size);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }
}

export default CategoryController;
