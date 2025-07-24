import { IAssignmentRepository } from "../interfaces/repositories/IAssignment.repository";
import { IAssignmentService } from "../interfaces/services/IAssignment.service";
import { IAssignment } from "../models/Assignment.model";
import { getObjectId } from "../utils/objectId";

class AssignmentService implements IAssignmentService {
  constructor(private _assignmentRepository: IAssignmentRepository) {}

  public async createAssignment(
    title: string,
    description: string,
    task: string,
    courseId: string
  ): Promise<IAssignment> {
    return await this._assignmentRepository.create({
      title,
      description,
      task,
      courseId: getObjectId(courseId),
    });
  }

  public async editAssignment(
    assignmentId: string,
    title: string,
    description: string,
    task: string
  ): Promise<IAssignment | null> {
    return await this._assignmentRepository.updateById(assignmentId, {
      title,
      description,
      task,
    });
  }

  public async deleteAssignment(assignmentId: string): Promise<void> {
    await this._assignmentRepository.deleteById(assignmentId);
  }

  public async getCourseAssignments(courseId: string): Promise<IAssignment[]> {
    return await this._assignmentRepository.getAssignmentsByCourseId(courseId);
  }

  public async getUserAssignments(userId: string, courseId: string) {
    return await this._assignmentRepository.getUserAssignments(
      userId,
      courseId
    );
  }

  public async getAssignmentById(assignmentId: string): Promise<IAssignment | null> {
    return await this._assignmentRepository.findById(assignmentId);
  }
}

export default AssignmentService;
