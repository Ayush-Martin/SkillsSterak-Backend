import { ICourse } from "../../models/Course.model";

export interface ICourseService {
  createCourse(course: Partial<ICourse>): Promise<ICourse>;
}
