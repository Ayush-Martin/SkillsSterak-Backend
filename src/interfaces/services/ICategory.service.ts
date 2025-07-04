import { ICategory } from "../../models/Category.model";

/**
 * Service interface for category-related business logic.
 * Supports category management, search, and listing features for admins and users.
 */
export interface ICategoryService {
  /**
   * Adds a new category by name.
   * Enables admins to expand course offerings and organize content.
   */
  addCategory(categoryName: string): Promise<ICategory>;

  /**
   * Edits the name of an existing category.
   * Supports content curation and correction workflows.
   */
  editCategoryName(
    categoryId: string,
    categoryName: string
  ): Promise<ICategory | null>;

  /**
   * Toggles the listed/unlisted status of a category.
   * Enables dynamic visibility control for category management.
   */
  listUnListCategory(categoryId: string): Promise<boolean>;

  /**
   * Retrieves all categories, returning partial data for lightweight listings.
   * Optimizes performance for dropdowns and summaries.
   */
  getAllCategories(): Promise<Array<Partial<ICategory>>>;

  /**
   * Retrieves paginated categories matching a search string.
   * Supports efficient browsing and filtering in the UI.
   */
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
