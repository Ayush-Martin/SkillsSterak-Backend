import { IModule } from "../../models/Module.model";
import { IBaseRepository } from "./IBase.repository";

export interface IModuleRepository extends IBaseRepository<IModule> {
  getModulesByCourseId(courseId: string): Promise<Array<IModule>>;
  getModule(moduleId: string): Promise<IModule | null>;
}
