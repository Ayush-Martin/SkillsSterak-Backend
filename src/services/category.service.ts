
import { ICategoryRepository } from "../interfaces/repositories/ICategory.repository";
import { ICategoryService } from "../interfaces/services/ICategory.service";
import { ICategory } from "../models/Category.model";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../constants/statusCodes";
import { CategoryMessage } from "../constants/responseMessages";

class CategoryService implements ICategoryService {
  constructor(private _categoryRepository: ICategoryRepository) {}

  public async addCategory(categoryName: string): Promise<ICategory> {
    const categoryExist = await this._categoryRepository.findByCategoryName(
      categoryName
    );

    if (categoryExist) {
      errorCreator(CategoryMessage.CategoryExists, StatusCodes.CONFLICT);
    }

    return await this._categoryRepository.create({ categoryName });
  }

  public async editCategoryName(
    categoryId: string,
    categoryName: string
  ): Promise<ICategory | null> {
    const categoryExist = await this._categoryRepository.findByCategoryName(
      categoryName
    );

    if (categoryExist && categoryExist.id != categoryId) {
      errorCreator(CategoryMessage.CategoryExists, StatusCodes.CONFLICT);
    }

    const category = await this._categoryRepository.updateById(categoryId, {
      categoryName,
    });

    return category;
  }

  public async listUnListCategory(categoryId: string): Promise<boolean> {
    const isListed = await this._categoryRepository.getCategoryListedStatus(
      categoryId
    );

    if (isListed === null) {
      errorCreator(CategoryMessage.CategoryNotFound, StatusCodes.BAD_REQUEST);
    }

    await this._categoryRepository.changeListStatus(categoryId, !isListed);

    return !isListed;
  }

  public async getAllCategories(): Promise<Array<Partial<ICategory>>> {
    return await this._categoryRepository.getAllCategories();
  }

  public async getCategories(
    search: string,
    page: number,
    size: number
  ): Promise<{
    categories: Array<ICategory>;
    currentPage: number;
    totalPages: number;
  }> {
    const searchRegex = new RegExp(search, "i");
    const skip = (page - 1) * size;
    const categories = await this._categoryRepository.getCategories(
      searchRegex,
      skip,
      size
    );

    const totalCategories = await this._categoryRepository.getCategoriesCount(
      searchRegex
    );
    const totalPages = Math.ceil(totalCategories / size);
    return {
      categories,
      currentPage: page,
      totalPages,
    };
  }
}

export default CategoryService;
