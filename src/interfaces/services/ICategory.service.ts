import { ICategory } from "../../models/Category.model";

export interface ICategoryService {
  /** add category */
  addCategory(categoryName: string): Promise<ICategory>;
  /** edit category name */
  editCategoryName(
    categoryId: string,
    categoryName: string
  ): Promise<ICategory | null>;
  /** list or unlist category */
  listUnListCategory(categoryId: string): Promise<boolean>;
  /** get all categories */
  getAllCategories(): Promise<Array<Partial<ICategory>>>;
  /** get categories by search */
  getCategories(
    search: string,
    page: number
  ): Promise<{
    categories: Array<ICategory>;
    currentPage: number;
    totalPages: number;
  }>;
}
