import { IUser } from "../../models/User.model";

export interface IProfileService {
  updateProfile(
    userId: string,
    { username, about }: { username: string; about: string }
  ): Promise<void | IUser | null>;
  updateProfileImage(userId: string, profileImage: string): Promise<void>;
}
