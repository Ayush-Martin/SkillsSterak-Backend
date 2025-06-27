import { INotebook } from "../../models/Notebook.model";
import { IBaseRepository } from "./IBase.repository";

export interface INotebookRepository extends IBaseRepository<INotebook> {
  getCourseNotebooks(courseId: string, userId: string): Promise<INotebook[]>;
}
