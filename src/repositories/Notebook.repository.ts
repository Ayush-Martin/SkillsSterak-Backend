import { Model } from "mongoose";
import { INotebookRepository } from "../interfaces/repositories/INotebook.repository";
import { INotebook } from "../models/Notebook.model";
import BaseRepository from "./Base.repository";

class NotebookRepository
  extends BaseRepository<INotebook>
  implements INotebookRepository
{
  constructor(private Notebook: Model<INotebook>) {
    super(Notebook);
  }

  public async getCourseNotebooks(
    courseId: string,
    userId: string
  ): Promise<INotebook[]> {
    return await this.Notebook.find(
      { courseId, userId },
      { _id: 1, title: 1, notes: 1 }
    );
  }
}

export default NotebookRepository;
