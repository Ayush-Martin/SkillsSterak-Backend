import mongoose, { Model, Mongoose, ObjectId } from "mongoose";
import { ITrainerRequestRepository } from "../interfaces/repositories/ITrainerRequest.repository";
import { ITrainerRequest } from "../models/TrainerRequest.model";
import BaseRepository from "./Base.repository";

class TrainerRequestRepository
  extends BaseRepository<ITrainerRequest>
  implements ITrainerRequestRepository
{
  constructor(private _TrainerRequest: Model<ITrainerRequest>) {
    super(_TrainerRequest);
  }

  public async changeRequestStatus(
    trainerRequestId: string,
    status: "approved" | "rejected",
    rejectedReason?: string
  ): Promise<ITrainerRequest | null> {
    const updateData: Partial<ITrainerRequest> = { status };

    if (rejectedReason) {
      updateData.rejectedReason = rejectedReason;
    }

    return await this._TrainerRequest.findByIdAndUpdate(
      trainerRequestId,
      updateData,
      { new: true }
    );
  }

  public async getRequestedUserCount(): Promise<number> {
    return await this._TrainerRequest.countDocuments({});
  }

  public async getRequestedUsers(skip: number, limit: number): Promise<any> {
    return await this._TrainerRequest
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "userId",
        select: "username email _id",
      });
  }

  public async getUserPreviousRequestDetails(
    userId: string
  ): Promise<ITrainerRequest | null> {
    return await this._TrainerRequest
      .findOne({ userId }, { status: 1, rejectedReason: 1 })
      .sort({
        createdAt: -1,
      });
  }
}

export default TrainerRequestRepository;
