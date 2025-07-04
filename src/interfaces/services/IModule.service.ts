import { IModule } from "../../models/Module.model";

export interface IModuleService {
  /**
   * Persists a new module within a course. Used by trainers to structure course content into logical sections.
   */
  createModule(module: Partial<IModule>): Promise<IModule>;

  /**
   * Retrieves all modules for a given course. Used to display course structure and for curriculum navigation.
   */
  getModules(courseId: string): Promise<Array<IModule>>;

  /**
   * Fetches a single module by its unique identifier. Used for module detail views and editing.
   */
  getModule(moduleId: string): Promise<IModule | null>;

  /**
   * Updates the title of a module. Used to allow trainers to rename sections for clarity or reorganization.
   */
  updateModuleTitle(moduleId: string, title: string): Promise<void>;

  /**
   * Removes a module from a course. Used to manage and update course structure.
   */
  deleteModule(moduleId: string): Promise<void>;
}
