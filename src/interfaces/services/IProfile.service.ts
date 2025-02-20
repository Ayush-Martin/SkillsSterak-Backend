import { IUser } from "../../models/User.model";

export interface IProfileService {
  updateProfile(
    userId: string,
    user: Partial<IUser>
  ): Promise<void | IUser | null>;
  updateProfileImage(
    userId: string,
    profileImage: string
  ): Promise<void | IUser | null>;
}
