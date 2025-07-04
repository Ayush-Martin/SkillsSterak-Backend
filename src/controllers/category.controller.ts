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

/**
 * Handles category CRUD operations and delegates business logic to the service layer.
 * All methods are bound to the instance for safe Express routing.
 */
class CategoryController {
  constructor(private categoryService: ICategoryService) {
    // Ensures 'this' context is preserved for all methods
    binder(this);
  }

  /**
   * Validates and creates a new category.
   * Returns the created category in the response.
   */
  public async addCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryName } = addCategoryValidator(req.body);

      const category = await this.categoryService.addCategory(categoryName);

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(CategoryMessage.CategoryAdded, category));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Updates the name of an existing category after validation.
   */
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
        .json(successResponse(CategoryMessage.CategoryUpdated, category));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Toggles a category's listed/unlisted status (soft visibility control).
   */
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
              ? CategoryMessage.CategoryListed
              : CategoryMessage.CategoryUnlisted,
            { categoryId, isListed }
          )
        );
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves all categories (no pagination or search).
   * Useful for admin panels or dropdowns.
   */
  public async getAllCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const categories = await this.categoryService.getAllCategories();

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, categories));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Returns paginated and searchable categories for efficient frontend rendering.
   */
  public async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, search, size } = paginatedGetDataValidator(req.query);

      const data = await this.categoryService.getCategories(search, page, size);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }
}

export default CategoryController;
