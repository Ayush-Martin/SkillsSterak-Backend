import { ICourse } from "../../models/Course.model";

export interface IAiChatRepository {
  /** Get course outline data by course ID */
  getCourseOutlineData(courseId: string): Promise<ICourse | null>;
  /** Set course outline data for a course */
  setCourseOutlineData(courseId: string, data: ICourse): Promise<void>;
}
