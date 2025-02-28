import { IModule } from "../../models/Module.model";

export interface IModuleService {
  createModule(module: Partial<IModule>): Promise<IModule>;
  getModules(courseId: string): Promise<Array<IModule>>;
  getModule(moduleId: string): Promise<IModule | null>;
  updateModuleTitle(moduleId: string, title: string): Promise<void>;
  deleteModule(moduleId: string): Promise<void>;
}
