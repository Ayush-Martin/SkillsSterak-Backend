import { IUser } from "../models/User.model";
import { IUserRepository } from "../interfaces/IUser.repository";
import { Model } from "mongoose";

class UserRepository implements IUserRepository {
  constructor(public User: Model<IUser>) {}

  public async createUser(user: Partial<IUser>): Promise<IUser> {
    return await this.User.create(user);
  }

  public async getUserById(userId: string): Promise<IUser | null> {
    return await this.User.findById(userId);
  }

  public async getUserByEmail(email: string): Promise<IUser | null> {
    return await this.User.findOne({ email });
  }

  public async updateUser(
    userId: string,
    user: Partial<IUser>
  ): Promise<IUser | null> {
    return await this.User.findByIdAndUpdate(userId, user);
  }

  public async changeBlockStatus(
    userId: string,
    status: boolean
  ): Promise<IUser | null> {
    return await this.User.findByIdAndUpdate(userId, { isBlocked: status });
  }

  public async changeTrainerStatus(
    userId: string,
    status: boolean
  ): Promise<IUser | null> {
    return await this.User.findByIdAndUpdate(userId, { isTrainer: status });
  }

  public async changePremiumStatus(
    userId: string,
    status: boolean
  ): Promise<IUser | null> {
    return await this.User.findByIdAndUpdate(userId, { isPremium: status });
  }
}

export default UserRepository;
