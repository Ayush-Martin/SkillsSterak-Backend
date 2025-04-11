import { ICategory } from "../../models/Category.model";

export interface ICategoryService {
  addCategory(categoryName: string): Promise<ICategory>;
  editCategoryName(
    categoryId: string,
    categoryName: string
  ): Promise<ICategory | null>;
  listUnListCategory(categoryId: string): Promise<boolean>;
  getAllCategories(): Promise<Array<Partial<ICategory>>>;
  getCategories(
    search: string,
    page: number,
    size: number
  ): Promise<{
    categories: Array<ICategory>;
    currentPage: number;
    totalPages: number;
  }>;
}
