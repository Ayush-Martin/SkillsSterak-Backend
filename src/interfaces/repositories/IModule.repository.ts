import { IModule } from "../../models/Module.model";
import { IBaseRepository } from "./IBase.repository";

/**
 * Repository interface for module-specific data operations.
 * Supports modular course structure and efficient module retrieval.
 */
export interface IModuleRepository extends IBaseRepository<IModule> {
  /**
   * Retrieves all modules for a given course.
   * Enables modular content delivery and course navigation.
   */
  getModulesByCourseId(courseId: string): Promise<Array<IModule>>;

  /**
   * Retrieves a single module by its unique identifier.
   * Supports direct access and editing of course modules.
   */
  getModule(moduleId: string): Promise<IModule | null>;
}
