import { IUser } from "../../models/User.model";

export interface IUserService {
  updateProfile(
    userId: string,
    { username, about }: { username: string; about: string }
  ): Promise<void | IUser | null>;

  updateProfileImage(userId: string, profileImage: string): Promise<void>;

  getUsers(
    search: string,
    page: number,
    size:number
  ): Promise<{ users: Array<IUser>; currentPage: number; totalPages: number }>;

  blockUnblockUser(userId: string): Promise<boolean>;

  sendTrainerRequest(userId: string): Promise<void>;
}
