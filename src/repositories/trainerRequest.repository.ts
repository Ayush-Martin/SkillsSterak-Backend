import { Model } from "mongoose";
import { ITrainerRequestRepository } from "../interfaces/repositories/ITrainerRequest.repository";
import { ITrainerRequest } from "../models/TrainerRequest.model";

class TrainerRequestRepository implements ITrainerRequestRepository {
  constructor(private TrainerRequest: Model<ITrainerRequest>) {}

  public async addTrainerRequest(
    userId: string
  ): Promise<ITrainerRequest | null> {
    const trainerRequest = new this.TrainerRequest({ userId });
    await trainerRequest.save();
    return trainerRequest;
  }

  public async changeRequestStatus(
    userId: string,
    status: "approved" | "rejected"
  ): Promise<ITrainerRequest | null> {
    console.log(userId);
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
