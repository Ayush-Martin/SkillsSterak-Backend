import { ICategory } from "../../models/Category.model";
import { IBaseRepository } from "./IBase.repository";

export interface ICategoryRepository extends IBaseRepository<ICategory> {
  /** update category listed status */
  changeListStatus(
    categoryId: string,
    isListed: boolean
  ): Promise<ICategory | null>;
  /** find category by name */
  findByCategoryName(categoryName: string): Promise<ICategory | null>;
  /** get category listed status */
  getCategoryListedStatus(categoryId: string): Promise<boolean | null>;
  /** get categories by search */
  getCategories(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<ICategory>>;
  /** get all categories */
  getAllCategories(): Promise<Array<Partial<ICategory>>>;
  /** get categories count */
  getCategoriesCount(search: RegExp): Promise<number>;
}
