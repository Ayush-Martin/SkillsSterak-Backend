import { ICategory } from "../../models/Category.model";
import { IBaseRepository } from "./IBase.repository";

export interface ICategoryRepository extends IBaseRepository<ICategory> {
  changeListStatus(
    categoryId: string,
    isListed: boolean
  ): Promise<ICategory | null>;
  findByCategoryName(categoryName: string): Promise<ICategory | null>;
  getCategoryListedStatus(categoryId: string): Promise<boolean | null>;
  getCategories(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<ICategory>>;
  getCategoriesCount(search: RegExp): Promise<number>;
}
