import mongoose from "mongoose";
import { IAssignmentSubmissionRepository } from "../interfaces/repositories/IAssignmentSubmission.repository";
import { IAssignmentSubmissionService } from "../interfaces/services/IAssignmentSubmission.service";
import { IAssignmentSubmission } from "../models/AssignmentSubmission.model";
import { getObjectId } from "../utils/objectId";

class AssignmentSubmissionService implements IAssignmentSubmissionService {
  constructor(
    private _AssignmentSubmissionRepository: IAssignmentSubmissionRepository
  ) {}

  public async submitAssignment(
    userId: string,
    courseId: string,
    assignmentId: string,
    type: "text" | "pdf" | "image",
    content?: string,
    path?: string
  ): Promise<any> {
    return await this._AssignmentSubmissionRepository.create({
      userId: getObjectId(userId),
      courseId: getObjectId(courseId),
      assignmentId: getObjectId(assignmentId),
      type,
      content,
      path,
      status: "completed",
    });
  }

  public async getTrainerAssignmentSubmissions(
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
  }> {
    const skip = (page - 1) * size;
    const filter: Record<string, any> = {};
    const searchRegex = new RegExp(search, "i");

    if (courseId !== "all") {
      filter["assignment.course._id"] = new mongoose.Types.ObjectId(courseId);
    }

    if (status !== "all") {
      filter["status"] = status;
    }

    console.log(filter);

    const submissions =
      await this._AssignmentSubmissionRepository.getTrainerAssignmentSubmissions(
        trainerId,
        searchRegex,
        filter,
        skip,
        size
      );

    const totalSubmissions =
      await this._AssignmentSubmissionRepository.getTrainerAssignmentSubmissionsCount(
        trainerId,
        searchRegex,
        filter
      );
    const totalPages = Math.ceil(totalSubmissions / size);

    return {
      assignmentSubmissions: submissions,
      currentPage: page,
      totalPages,
    };
  }

  public async changeSubmissionStatus(
    assignmentSubmissionId: string,
    status: "verified" | "redo"
  ): Promise<IAssignmentSubmission | null> {
    return await this._AssignmentSubmissionRepository.changeSubmissionStatus(
      assignmentSubmissionId,
      status
    );
  }

  public async resubmitAssignment(
    assignmentSubmissionId: string,
    type: "text" | "pdf" | "image",
    content?: string,
    path?: string
  ): Promise<IAssignmentSubmission | null> {
    return await this._AssignmentSubmissionRepository.updateById(
      assignmentSubmissionId,
      { type, content, path, status: "completed" }
    );
  }
}

export default AssignmentSubmissionService;
