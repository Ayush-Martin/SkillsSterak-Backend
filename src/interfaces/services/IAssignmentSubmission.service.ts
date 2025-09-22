import { IAssignmentSubmission } from "../../models/AssignmentSubmission.model";

export interface IAssignmentSubmissionService {
  submitAssignment(
    userId: string,
    courseId: string,
    assignmentId: string,
    type: "text" | "pdf" | "image",
    content?: string,
    path?: string
  ): Promise<any>;

  getTrainerAssignmentSubmissions(
    trainerId: string,
    courseId: string | "all",
    status: "completed" | "verified" | "redo" | "all",
    search: string,
    page: number,
    size: number
  ): Promise<{
    assignmentSubmissions: IAssignmentSubmission[];
    currentPage: number;
    totalPages: number;
  }>;

  changeSubmissionStatus(
    assignmentSubmissionId: string,
    status: "verified" | "redo"
  ): Promise<IAssignmentSubmission | null>;

  resubmitAssignment(
    assignmentSubmissionId: string,
    type: "text" | "pdf" | "image",
    content?: string,
    path?: string
  ): Promise<IAssignmentSubmission | null>;
}
