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

  public async getLesson(lessonId: string): Promise<ILesson | null> {
    return await this.Lesson.findById(lessonId, {
      _id: 1,
      title: 1,
      description: 1,
      type: 1,
      path: 1,
    });
  }
}

export default LessonRepository;
