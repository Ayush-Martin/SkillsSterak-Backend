import { INotebookRepository } from "../interfaces/repositories/INotebook.repository";
import { INotebookService } from "../interfaces/services/INotebook.service";
import { INotebook } from "../models/Notebook.model";
import { getObjectId } from "../utils/objectId";

class NotebookService implements INotebookService {
  constructor(private notebookRepository: INotebookRepository) {}

  public async getCourseNotebooks(
    userId: string,
    courseId: string
  ): Promise<INotebook[]> {
    return await this.notebookRepository.getCourseNotebooks(courseId, userId);
  }

  public async addNoteBook(
    userId: string,
    courseId: string,
    title: string
  ): Promise<INotebook> {
    return await this.notebookRepository.create({
      userId: getObjectId(userId),
      courseId: getObjectId(courseId),
      title,
      notes: [],
    });
  }

  public async deleteNoteBook(noteBookId: string): Promise<void> {
    await this.notebookRepository.deleteById(noteBookId);
  }

  public async updateNoteBook(
    noteBookId: string,
    title: string,
    notes: string[]
  ): Promise<null | INotebook> {
    return await this.notebookRepository.updateById(noteBookId, {
      title,
      notes,
    });
  }
}

export default NotebookService;
