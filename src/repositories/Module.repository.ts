import mongoose, { Model } from "mongoose";
import { IModuleRepository } from "../interfaces/repositories/IModule.repository";
import { IModule } from "../models/Module.model";
import BaseRepository from "./Base.repository";

class ModuleRepository
  extends BaseRepository<IModule>
  implements IModuleRepository
{
  constructor(private _Module: Model<IModule>) {
    super(_Module);
  }

  public async getModulesByCourseId(courseId: string): Promise<Array<IModule>> {
    return await this._Module.aggregate([
      {
        $match: {
          courseId: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $lookup: {
          from: "lessons",
          localField: "_id",
          foreignField: "moduleId",
          as: "lessons",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
  }

  public async getModule(moduleId: string): Promise<IModule> {
    const module = await this._Module.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(moduleId),
        },
      },
      {
        $lookup: {
          from: "lessons",
          localField: "_id",
          foreignField: "moduleId",
          as: "lessons",
        },
      },
    ]);

    return module[0];
  }
}

export default ModuleRepository;
