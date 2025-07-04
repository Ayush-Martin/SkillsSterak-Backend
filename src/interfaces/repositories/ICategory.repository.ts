import { ICategory } from "../../models/Category.model";
import { IBaseRepository } from "./IBase.repository";

/**
 * Repository interface for category-specific data operations.
 * Extends the base repository to support category management and search features.
 */
export interface ICategoryRepository extends IBaseRepository<ICategory> {
  /**
   * Changes the listed status of a category (e.g., visible or hidden to users).
   * Supports admin workflows for controlling category availability.
   */
  changeListStatus(
    categoryId: string,
    isListed: boolean
  ): Promise<ICategory | null>;

  /**
   * Finds a category by its unique name.
   * Enables validation and prevents duplicate category creation.
   */
  findByCategoryName(categoryName: string): Promise<ICategory | null>;

  /**
   * Retrieves the listed status of a category.
   * Useful for UI toggles and access control logic.
   */
  getCategoryListedStatus(categoryId: string): Promise<boolean | null>;

  /**
   * Searches for categories matching a pattern, with pagination support.
   * Enables efficient category browsing and filtering in the UI.
   */
  getCategories(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<ICategory>>;

  /**
   * Retrieves all categories, returning only partial data for lightweight listings.
   * Optimizes performance for category dropdowns or summaries.
   */
  getAllCategories(): Promise<Array<Partial<ICategory>>>;

  /**
   * Returns the count of categories matching a search pattern.
   * Supports pagination and analytics features.
   */
  getCategoriesCount(search: RegExp): Promise<number>;
}
