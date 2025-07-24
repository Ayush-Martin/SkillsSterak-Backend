import { IAssignment } from "../../models/Assignment.model";
import { IBaseRepository } from "./IBase.repository";

export interface IAssignmentRepository extends IBaseRepository<IAssignment> {
  getAssignmentsByCourseId(courseId: string): Promise<IAssignment[]>;
  getUserAssignments(userId: string, courseId: string): Promise<IAssignment[]>;
}
