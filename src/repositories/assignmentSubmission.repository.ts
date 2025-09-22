import mongoose, { Model } from "mongoose";
import { IAssignmentSubmissionRepository } from "../interfaces/repositories/IAssignmentSubmission.repository";
import { IAssignmentSubmission } from "../models/AssignmentSubmission.model";
import BaseRepository from "./Base.repository";

class AssignmentSubmissionRepository
  extends BaseRepository<IAssignmentSubmission>
  implements IAssignmentSubmissionRepository
{
  constructor(private _AssignmentSubmission: Model<IAssignmentSubmission>) {
    super(_AssignmentSubmission);
  }

  public async getTrainerAssignmentSubmissions(
    trainerId: string,
    search: RegExp,
    filter: Record<string, any>,
    skip: number,
    limit: number
  ): Promise<IAssignmentSubmission[]> {
    return await this._AssignmentSubmission.aggregate([
      {
        $lookup: {
          from: "assignments",
          localField: "assignmentId",
          foreignField: "_id",
          pipeline: [
            {
              $lookup: {
                from: "courses",
                localField: "courseId",
                foreignField: "_id",
                pipeline: [
                  {
                    $project: {
                      trainerId: 1,
                      title: 1,
                    },
                  },
                ],
                as: "course",
              },
            },
            {
              $unwind: "$course",
            },
            {
              $project: {
                title: 1,
                description: 1,
                task: 1,
                course: 1,
              },
            },
          ],
          as: "assignment",
        },
      },
      {
        $unwind: "$assignment",
      },
      {
        $match: {
          "assignment.course.trainerId": new mongoose.Types.ObjectId(trainerId),
          "assignment.title": search,
          ...filter,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                email: 1,
              },
            },
          ],
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          title: "$assignment.title",
          description: "$assignment.description",
          task: "$assignment.task",
          status: 1,
          type: 1,
          content: 1,
          course: "$assignment.course",
          user: 1,
          path: 1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
  }

  public async getTrainerAssignmentSubmissionsCount(
    trainerId: string,
    search: RegExp,
    filter: Record<string, any>
  ): Promise<number> {
    const result = await this._AssignmentSubmission.aggregate([
      {
        $lookup: {
          from: "assignments",
          localField: "assignmentId",
          foreignField: "_id",
          pipeline: [
            {
              $lookup: {
                from: "courses",
                localField: "courseId",
                foreignField: "_id",
                pipeline: [
                  {
                    $project: {
                      trainerId: 1,
                    },
                  },
                ],
                as: "course",
              },
            },
            {
              $unwind: "$course",
            },
            {
              $project: {
                course: 1,
                title: 1,
                status: 1,
              },
            },
          ],
          as: "assignment",
        },
      },
      {
        $unwind: "$assignment",
      },
      {
        $match: {
          "assignment.course.trainerId": new mongoose.Types.ObjectId(trainerId),
          "assignment.title": search,
          ...filter,
        },
      },
      {
        $count: "totalCount",
      },
    ]);

    return result[0]?.totalCount || 0;
  }

  public async changeSubmissionStatus(
    assignmentSubmissionId: string,
    status: "verified" | "redo"
  ): Promise<IAssignmentSubmission | null> {
    return await this._AssignmentSubmission.findOneAndUpdate(
      { _id: assignmentSubmissionId },
      { status },
      { new: true }
    );
  }
}

export default AssignmentSubmissionRepository;
