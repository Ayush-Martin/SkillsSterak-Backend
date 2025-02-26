import mongoose, { Model, Mongoose, ObjectId } from "mongoose";
import { ITrainerRequestRepository } from "../interfaces/repositories/ITrainerRequest.repository";
import { ITrainerRequest } from "../models/TrainerRequest.model";
import BaseRepository from "./Base.repository";

class TrainerRequestRepository
  extends BaseRepository<ITrainerRequest>
  implements ITrainerRequestRepository
{
  constructor(private TrainerRequest: Model<ITrainerRequest>) {
    super(TrainerRequest);
  }

  public async addTrainerRequest(
    userId: string
  ): Promise<ITrainerRequest | null> {
    const objectId = new mongoose.Schema.Types.ObjectId(userId);
    return await this.create({ userId: objectId });
  }

  public async changeRequestStatus(
    userId: string,
    status: "approved" | "rejected"
  ): Promise<ITrainerRequest | null> {
    return await this.TrainerRequest.findOneAndUpdate(
      { userId },
      { status },
      { new: true }
    );
  }

  public async getRequestedUserCount(): Promise<number> {
    return await this.TrainerRequest.countDocuments({});
  }

  public async getRequestedUsers(skip: number, limit: number): Promise<any> {
    return await this.TrainerRequest.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "userId",
        select: "username email _id",
      });
  }
}

export default TrainerRequestRepository;
