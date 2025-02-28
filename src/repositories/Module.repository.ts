import { Model } from "mongoose";
import { IModuleRepository } from "../interfaces/repositories/IModule.repository";
import { IModule } from "../models/Module.model";
import BaseRepository from "./Base.repository";

class ModuleRepository
  extends BaseRepository<IModule>
  implements IModuleRepository
{
  constructor(private Module: Model<IModule>) {
    super(Module);
  }

  public async getModulesByCourseId(courseId: string): Promise<Array<IModule>> {
    return await this.Module.find({ courseId });
  }
}

export default ModuleRepository;
