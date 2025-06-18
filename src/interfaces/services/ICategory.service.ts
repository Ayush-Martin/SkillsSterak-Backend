import { ICategory } from "../../models/Category.model";

export interface ICategoryService {
  /** Get a category by its ID */
  addCategory(categoryName: string): Promise<ICategory>;
  /** Edit the name of a category */
  editCategoryName(
    categoryId: string,
    categoryName: string
  ): Promise<ICategory | null>;
  /** Toggle the listed/unlisted status of a category */
  listUnListCategory(categoryId: string): Promise<boolean>;
  /** Get all categories (partial data) */
  getAllCategories(): Promise<Array<Partial<ICategory>>>;
  /** Get paginated categories with search */
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
