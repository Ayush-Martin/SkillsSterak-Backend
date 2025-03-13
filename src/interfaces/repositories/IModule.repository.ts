import { IModule } from "../../models/Module.model";
import { IBaseRepository } from "./IBase.repository";

/** IModuleRepository interface defines methods for managing modules. */
export interface IModuleRepository extends IBaseRepository<IModule> {
  /** Gets modules by course id. */
  getModulesByCourseId(courseId: string): Promise<Array<IModule>>;
  /** Gets a module by id. */
  getModule(moduleId: string): Promise<IModule | null>;
}
