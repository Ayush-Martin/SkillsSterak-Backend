import { IAssignmentSubmission } from "../../models/AssignmentSubmission.model";
import { IBaseRepository } from "./IBase.repository";

export interface IAssignmentSubmissionRepository
  extends IBaseRepository<IAssignmentSubmission> {
  getTrainerAssignmentSubmissions(
    trainerId: string,
    search: RegExp,
    filter: Record<string, any>,
    skip: number,
    limit: number
  ): Promise<IAssignmentSubmission[]>;
  getTrainerAssignmentSubmissionsCount(
    trainerId: string,
    search: RegExp,
    filter: Record<string, any>
  ): Promise<number>;
  changeSubmissionStatus(
    assignmentSubmissionId: string,
    status: "verified" | "redo"
  ): Promise<IAssignmentSubmission | null>;
}
