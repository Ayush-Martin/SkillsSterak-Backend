import { Model } from "mongoose";
import { ILessonRepository } from "../interfaces/repositories/ILesson.repository";
import BaseRepository from "./Base.repository";
import { ILesson } from "../models/Lesson.model";

class LessonRepository
  extends BaseRepository<ILesson>
  implements ILessonRepository
{
  constructor(private Lesson: Model<ILesson>) {
    super(Lesson);
  }

  public async getLessons(moduleId: string): Promise<Array<ILesson>> {
    return await this.Lesson.find({ moduleId });
  }
}

export default LessonRepository;
