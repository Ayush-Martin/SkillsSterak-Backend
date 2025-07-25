import mongoose, { Model, mongo } from "mongoose";
import { ILessonRepository } from "../interfaces/repositories/ILesson.repository";
import BaseRepository from "./Base.repository";
import { ILesson } from "../models/Lesson.model";

class LessonRepository
  extends BaseRepository<ILesson>
  implements ILessonRepository
{
  constructor(private _Lesson: Model<ILesson>) {
    super(_Lesson);
  }

  public async getLessons(moduleId: string): Promise<Array<ILesson>> {
    return await this._Lesson.find({ moduleId });
  }

  public async getLesson(lessonId: string): Promise<ILesson | null> {
    return await this._Lesson.findById(lessonId, {
      _id: 1,
      title: 1,
      description: 1,
      type: 1,
      path: 1,
    });
  }

  public async getCourseLessonsDuration(courseId: string): Promise<number> {
    const data = await this._Lesson.aggregate([
      { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
      { $group: { _id: null, totalDuration: { $sum: "$duration" } } },
    ]);

    return data[0]?.totalDuration || 0;
  }
}

export default LessonRepository;
