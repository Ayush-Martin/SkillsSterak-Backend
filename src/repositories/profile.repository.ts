import { Model } from "mongoose";
import { IProfileRepository } from "../interfaces/repositories/IProfile.repository";
import { IUser } from "../models/User.model";

class ProfileRepository implements IProfileRepository {
  constructor(private User: Model<IUser>) {}

  public async changeProfileImage(
    userId: string,
    profileImage: string
  ): Promise<null | IUser> {
    return await this.User.findByIdAndUpdate(
      userId,
      { profileImage },
      { new: true }
    );
  }

  public async update(userId: string, user: IUser): Promise<null | IUser> {
    return await this.User.findByIdAndUpdate(userId, user, { new: true });
  }
}
