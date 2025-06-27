import { IUser } from "../../models/User.model";

export interface IUserService {
  /** Updates the profile information for a user. */
  updateProfile(
    userId: string,
    updatedData: Partial<IUser>
  ): Promise<void | IUser | null>;

  /** Updates the profile image for a user. */
  updateProfileImage(userId: string, profileImage: string): Promise<void>;

  /** Retrieves a paginated list of users with search. */
  getUsers(
    search: string,
    page: number,
    size: number
  ): Promise<{ users: Array<IUser>; currentPage: number; totalPages: number }>;

  /** Blocks or unblocks a user. */
  blockUnblockUser(userId: string): Promise<boolean>;

  /** Sends a trainer request for a user. */
  sendTrainerRequest(userId: string): Promise<void>;
}
