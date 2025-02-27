import { Model } from "mongoose";
import { ICourseRepository } from "../interfaces/repositories/ICourse.repository";
import { ICourse } from "../models/Course.model";
import BaseRepository from "./Base.repository";

class CourseRepository
  extends BaseRepository<ICourse>
  implements ICourseRepository
{
  constructor(private Course: Model<ICourse>) {
    super(Course);
  }

  public async findCourseByTitle(title: string): Promise<ICourse | null> {
    return await this.Course.findOne({ title: new RegExp(title, "i") });
  }
}

export default CourseRepository;
