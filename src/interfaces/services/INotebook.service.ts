import { INotebook } from "../../models/Notebook.model";

export interface INotebookService {
  /**
   * Retrieves all notebooks for a user within a specific course. Used to display and manage user notes per course context.
   */
  getCourseNotebooks(
    userId: string,
    courseId: string
  ): Promise<null | INotebook[]>;

  /**
   * Creates a new notebook for a user in a course. Used to enable note-taking and personal study organization.
   */
  addNoteBook(
    userId: string,
    courseId: string,
    title: string
  ): Promise<INotebook>;

  /**
   * Deletes a notebook by its identifier. Used to allow users to manage and clean up their notes.
   */
  deleteNoteBook(noteBookId: string): Promise<void>;

  /**
   * Updates the title or notes content of a notebook. Used for editing and maintaining user notes.
   */
  updateNoteBook(
    noteBookId: string,
    title: string,
    notes: string[]
  ): Promise<null | INotebook>;
}
