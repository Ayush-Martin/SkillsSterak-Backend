import { IAssignmentSubmission } from "../../models/AssignmentSubmission.model";
import { IBaseRepository } from "./IBase.repository";

export interface IAssignmentSubmissionRepository
  extends IBaseRepository<IAssignmentSubmission> {
  getTrainerAssignmentSubmissions(
    trainerId: string,
    skip: number,
    limit: number
  ): Promise<IAssignmentSubmission[]>;
  getTrainerAssignmentSubmissionsCount(trainerId: string): Promise<number>;
  changeSubmissionStatus(
    assignmentSubmissionId: string,
    status: "verified" | "redo"
  ): Promise<IAssignmentSubmission | null>;
}
