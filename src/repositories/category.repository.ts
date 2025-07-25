import { Model } from "mongoose";
import { ICategoryRepository } from "../interfaces/repositories/ICategory.repository";
import { ICategory } from "../models/Category.model";
import BaseRepository from "./Base.repository";

class CategoryRepository
  extends BaseRepository<ICategory>
  implements ICategoryRepository
{
  constructor(private _Category: Model<ICategory>) {
    super(_Category);
  }

  public async changeListStatus(
    categoryId: string,
    isListed: boolean
  ): Promise<ICategory | null> {
    return this._Category.findByIdAndUpdate(
      categoryId,
      { isListed },
      { new: true }
    );
  }

  public async findByCategoryName(
    categoryName: string
  ): Promise<ICategory | null> {
    return await this._Category.findOne({
      categoryName: new RegExp(`^${categoryName}$`, "i"),
    });
  }

  public async getCategories(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<ICategory>> {
    return await this._Category
      .find({ categoryName: search })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);
  }

  public async getAllCategories(): Promise<Array<Partial<ICategory>>> {
    return await this._Category.find(
      { isListed: true },
      { categoryName: 1, _id: 1 }
    );
  }

  public async getCategoryListedStatus(
    categoryId: string
  ): Promise<boolean | null> {
    const data = await this._Category.findById(categoryId, {
      _id: 0,
      isListed: 1,
    });

    if (!data) return null;

    return data.isListed!;
  }

  public async getCategoriesCount(search: RegExp): Promise<number> {
    return await this._Category.countDocuments({ categoryName: search });
  }
}

export default CategoryRepository;
