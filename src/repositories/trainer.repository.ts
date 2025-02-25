import { Model } from "mongoose";
import { ITrainerRepository } from "../interfaces/repositories/ITrainer.repository";
import { IUser } from "../models/User.model";

class TrainerRepository implements ITrainerRepository {
  constructor(private User: Model<IUser>) {}

  public async getTrainers(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<IUser>> {
    return await this.User.find({ email: search, role: "trainer" })
      .skip(skip)
      .limit(limit);
  }

  public async countTrainers(search: RegExp): Promise<number> {
    return await this.User.countDocuments({ email: search });
  }

  public async changeRole(
    userId: string,
    role: "user" | "trainer"
  ): Promise<IUser | null> {
    return await this.User.findByIdAndUpdate(userId, { role }, { new: true });
  }
}

export default TrainerRepository;
