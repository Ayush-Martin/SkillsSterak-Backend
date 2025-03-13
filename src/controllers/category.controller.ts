import { NextFunction, Request, Response } from "express";
import { ICategoryService } from "../interfaces/services/ICategory.service";
import {
  addCategoryValidator,
  editCategoryValidator,
} from "../validators/category.validator";
import { StatusCodes } from "../utils/statusCodes";
import { successResponse } from "../utils/responseCreators";
import {
  ADD_CATEGORY_SUCCESS_MESSAGE,
  CATEGORY_LISTED_SUCCESS_MESSAGE,
  CATEGORY_UN_LISTED_SUCCESS_MESSAGE,
  EDIT_CATEGORY_SUCCESS_MESSAGE,
  GET_DATA_SUCCESS_MESSAGE,
} from "../constants/responseMessages";
import binder from "../utils/binder";
import { paginatedGetDataValidator } from "../validators/index.validator";

class CategoryController {
  constructor(private categoryService: ICategoryService) {
    binder(this);
  }

  public async addCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryName } = addCategoryValidator(req.body);

      const category = await this.categoryService.addCategory(categoryName);

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(ADD_CATEGORY_SUCCESS_MESSAGE, { category }));
    } catch (err) {
      next(err);
    }
  }

  public async editCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.params;

      const { categoryName } = editCategoryValidator(req.body);

      const category = await this.categoryService.editCategoryName(
        categoryId,
        categoryName
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(EDIT_CATEGORY_SUCCESS_MESSAGE, category));
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

      const isListed = await this.categoryService.listUnListCategory(
        categoryId
      );

      res
        .status(StatusCodes.OK)
        .json(
          successResponse(
            isListed
              ? CATEGORY_LISTED_SUCCESS_MESSAGE
              : CATEGORY_UN_LISTED_SUCCESS_MESSAGE,
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
      const categories = await this.categoryService.getAllCategories();

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, categories));
    } catch (err) {
      next(err);
    }
  }

  public async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, search } = paginatedGetDataValidator(req.query);

      const data = await this.categoryService.getCategories(search, page);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }
}

export default CategoryController;
