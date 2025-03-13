import { IModule } from "../../models/Module.model";

export interface IModuleService {
  /** Creates a new module */
  createModule(module: Partial<IModule>): Promise<IModule>;
  /** Gets all modules that belong to a course */
  getModules(courseId: string): Promise<Array<IModule>>;
  /** Gets a module by id */
  getModule(moduleId: string): Promise<IModule | null>;
  /** Updates the title of a module */
  updateModuleTitle(moduleId: string, title: string): Promise<void>;
  /** Deletes a module */
  deleteModule(moduleId: string): Promise<void>;
}
