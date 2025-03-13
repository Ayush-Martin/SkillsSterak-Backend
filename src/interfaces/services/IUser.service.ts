import { IUser } from "../../models/User.model";

export interface IUserService {
  /** Updates profile of the user*/
  updateProfile(
    userId: string,
    { username, about }: { username: string; about: string }
  ): Promise<void | IUser | null>;
  /** Updates profile image of the user*/
  updateProfileImage(userId: string, profileImage: string): Promise<void>;
  /** Gets users*/
  getUsers(
    search: string,
    page: number
  ): Promise<{ users: Array<IUser>; currentPage: number; totalPages: number }>;
  /** Blocks or unblocks a user*/
  blockUnblockUser(userId: string): Promise<boolean>;
  /** Sends a trainer request*/
  sendTrainerRequest(userId: string): Promise<void>;
}
