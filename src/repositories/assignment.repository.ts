import mongoose, { Model } from "mongoose";
import { IAssignmentRepository } from "../interfaces/repositories/IAssignment.repository";
import { IAssignment } from "../models/Assignment.model";
import BaseRepository from "./Base.repository";

class AssignmentRepository
  extends BaseRepository<IAssignment>
  implements IAssignmentRepository
{
  constructor(private _Assignment: Model<IAssignment>) {
    super(_Assignment);
  }

  public async getAssignmentsByCourseId(
    courseId: string
  ): Promise<IAssignment[]> {
    return await this._Assignment.find(
      { courseId },
      { _id: 1, title: 1, description: 1, task: 1 }
    );
  }

  public async getUserAssignments(
    userId: string,
    courseId: string
  ): Promise<IAssignment[]> {
    return await this._Assignment.aggregate([
      {
        $match: {
          courseId: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $lookup: {
          from: "assignmentsubmissions",
          localField: "_id",
          foreignField: "assignmentId",
          pipeline: [
            {
              $match: {
                userId: new mongoose.Types.ObjectId(userId),
              },
            },
          ],
          as: "submissionDetails",
        },
      },
      {
        $unwind: {
          path: "$submissionDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          title: 1,
          task: 1,
          description: 1,
          status: {
            $ifNull: ["$submissionDetails.status", "pending"],
          },
          type: "$submissionDetails.type",
          path: "$submissionDetails.path",
          content: "$submissionDetails.content",
          assignmentSubmissionId: "$submissionDetails._id",
        },
      },
    ]);
  }
}
export default AssignmentRepository;
