import { ICourse } from "../../models/Course.model";

export interface IAiChatRepository {
  getCourseOutlineData(courseId: string): Promise<ICourse | null>;
  setCourseOutlineData(courseId: string, data: ICourse): Promise<void>;
}
