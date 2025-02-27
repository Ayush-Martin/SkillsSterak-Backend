import { RECORDS_PER_PAGE } from "../constants/general";
import {
  CATEGORY_EXIST_ERROR_MESSAGE,
  CATEGORY_NOT_FOUND_ERROR_MESSAGE,
} from "../constants/responseMessages";
import { ICategoryRepository } from "../interfaces/repositories/ICategory.repository";
import { ICategoryService } from "../interfaces/services/ICategory.service";
import { ICategory } from "../models/Category.model";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../utils/statusCodes";

class CategoryService implements ICategoryService {
  constructor(private categoryRepository: ICategoryRepository) {}

  public async addCategory(categoryName: string): Promise<ICategory> {
    const categoryExist = await this.categoryRepository.findByCategoryName(
      categoryName
    );

    if (categoryExist) {
      errorCreator(CATEGORY_EXIST_ERROR_MESSAGE, StatusCodes.CONFLICT);
    }

    return await this.categoryRepository.create({ categoryName });
  }

  public async editCategoryName(
    categoryId: string,
    categoryName: string
  ): Promise<ICategory | null> {
    const categoryExist = await this.categoryRepository.findByCategoryName(
      categoryName
    );

    if (categoryExist && categoryExist.id != categoryId) {
      errorCreator(CATEGORY_EXIST_ERROR_MESSAGE, StatusCodes.CONFLICT);
    }

    const category = await this.categoryRepository.updateById(categoryId, {
      categoryName,
    });

    return category;
  }

  public async listUnListCategory(categoryId: string): Promise<boolean> {
    const isListed = await this.categoryRepository.getCategoryListedStatus(
      categoryId
    );

    if (isListed === null) {
      errorCreator(CATEGORY_NOT_FOUND_ERROR_MESSAGE, StatusCodes.BAD_REQUEST);
    }

    await this.categoryRepository.changeListStatus(categoryId, !isListed);

    return !isListed;
  }

  public async getAllCategories(): Promise<Array<Partial<ICategory>>> {
    return await this.categoryRepository.getAllCategories();
  }

  public async getCategories(
    search: string,
    page: number
  ): Promise<{
    categories: Array<ICategory>;
    currentPage: number;
    totalPages: number;
  }> {
    const searchRegex = new RegExp(search, "i");
    const skip = (page - 1) * RECORDS_PER_PAGE;
    const categories = await this.categoryRepository.getCategories(
      searchRegex,
      skip,
      RECORDS_PER_PAGE
    );

    const totalCategories = await this.categoryRepository.getCategoriesCount(
      searchRegex
    );
    const totalPages = Math.ceil(totalCategories / RECORDS_PER_PAGE);
    return {
      categories,
      currentPage: page,
      totalPages,
    };
  }
}

export default CategoryService;
