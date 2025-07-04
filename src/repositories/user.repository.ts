import { IUser } from "../models/User.model";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { Model } from "mongoose";
import BaseRepository from "./Base.repository";

class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor(private User: Model<IUser>) {
    super(User);
  }

  public async getAdmin(): Promise<IUser | null> {
    return await this.User.findOne({ role: "admin" });
  }

  public async getUsers(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<IUser>> {
    return await this.User.find(
      { email: search, role: { $ne: "admin" } },
      { username: 1, email: 1, isBlocked: 1, role: 1, profileImage: 1 }
    )
      .skip(skip)
      .limit(limit);
  }

  public async getUserEmail(userId: string): Promise<string | undefined> {
    const user = await this.User.findById(userId, { email: 1 });

    return user?.email;
  }

  public async getUserByEmail(email: string): Promise<IUser | null> {
    return await this.User.findOne({ email });
  }

  public async getUserByGoogleId(googleId: string): Promise<IUser | null> {
    return await this.User.findOne({ googleId });
  }

  public async getUserBlockStatus(
    userId: string
  ): Promise<{ isBlocked: boolean } | null> {
    return await this.User.findById(userId, { _id: 0, isBlocked: 1 });
  }

  public async getUsersCount(search: RegExp): Promise<number> {
    return await this.User.countDocuments({
      email: search,
      role: { $ne: "admin" },
    });
  }

  public async updatePassword(
    userId: string,
    password: string
  ): Promise<IUser | null> {
    return await this.User.findByIdAndUpdate(
      userId,
      { password: password },
      { new: true }
    );
  }

  public async updateUser(
    userId: string,
    user: Partial<IUser>
  ): Promise<IUser | null> {
    return await this.User.findByIdAndUpdate(userId, user, { new: true });
  }

  public async updateProfileImage(
    userId: string,
    profileImage: string
  ): Promise<IUser | null> {
    return await this.User.findByIdAndUpdate(
      userId,
      { profileImage },
      { new: true }
    );
  }

  public async changeBlockStatus(
    userId: string,
    status: boolean
  ): Promise<IUser | null> {
    return await this.User.findByIdAndUpdate(userId, { isBlocked: status });
  }

  public async changePremiumStatus(
    userId: string,
    status: boolean
  ): Promise<IUser | null> {
    return await this.User.findByIdAndUpdate(userId, { isPremium: status });
  }

  public async updateStripeAccountId(
    userId: string,
    stripeAccountId: string
  ): Promise<IUser | null> {
    return await this.User.findByIdAndUpdate(userId, { stripeAccountId });
  }
}

export default UserRepository;
