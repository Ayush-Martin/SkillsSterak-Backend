import { IModuleRepository } from "../interfaces/repositories/IModule.repository";
import { IModuleService } from "../interfaces/services/IModule.service";
import { IModule } from "../models/Module.model";

class ModuleService implements IModuleService {
  constructor(private _moduleRepository: IModuleRepository) {}

  public async createModule(module: Partial<IModule>): Promise<IModule> {
    return await this._moduleRepository.create(module);
  }

  public async getModules(courseId: string): Promise<Array<IModule>> {
    return await this._moduleRepository.getModulesByCourseId(courseId);
  }

  public async getModule(moduleId: string): Promise<IModule | null> {
    return await this._moduleRepository.getModule(moduleId);
  }

  public async updateModuleTitle(
    moduleId: string,
    title: string
  ): Promise<void> {
    await this._moduleRepository.updateById(moduleId, { title });
  }

  public async deleteModule(moduleId: string): Promise<void> {
    await this._moduleRepository.deleteById(moduleId);
  }
}

export default ModuleService;
