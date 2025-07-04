import { INotebook } from "../../models/Notebook.model";
import { IBaseRepository } from "./IBase.repository";

/**
 * Repository interface for notebook-related data operations.
 * Supports user-generated notes and course-specific notebook retrieval.
 */
export interface INotebookRepository extends IBaseRepository<INotebook> {
  /**
   * Retrieves all notebooks for a given course and user.
   * Enables personalized note-taking and study workflows.
   */
  getCourseNotebooks(courseId: string, userId: string): Promise<INotebook[]>;
}
