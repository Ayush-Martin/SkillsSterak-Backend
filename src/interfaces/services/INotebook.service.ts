import { INotebook } from "../../models/Notebook.model";

export interface INotebookService {
  getCourseNotebooks(
    userId: string,
    courseId: string
  ): Promise<null | INotebook[]>;
  addNoteBook(
    userId: string,
    courseId: string,
    title: string
  ): Promise<INotebook>;
  deleteNoteBook(noteBookId: string): Promise<void>;
  updateNoteBook(
    noteBookId: string,
    title: string,
    notes: string[]
  ): Promise<null | INotebook>;
}
