import { IUser } from "../../models/User.model";

export interface IUserService {
  /**
   * Updates a user's profile information. Used to allow users to manage their personal details and preferences.
   */
  updateProfile(
    userId: string,
    updatedData: Partial<IUser>
  ): Promise<void | IUser | null>;

  /**
   * Updates the profile image for a user. Used to personalize user accounts and enhance user experience.
   */
  updateProfileImage(userId: string, profileImage: string): Promise<void>;

  /**
   * Returns a paginated list of users matching a search query. Used for admin management, user discovery, and analytics.
   */
  getUsers(
    search: string,
    page: number,
    size: number
  ): Promise<{ users: Array<IUser>; currentPage: number; totalPages: number }>;

  /**
   * Toggles the blocked status of a user. Used for moderation, abuse prevention, and account management.
   */
  blockUnblockUser(userId: string): Promise<boolean>;

  /**
   * Submits a trainer request for a user. Used to initiate the process of becoming a trainer on the platform.
   */
  sendTrainerRequest(userId: string): Promise<void>;

  /**
   * Returns the total number of users in the system. Used for admin analytics and reporting.
   */
  getAdminUsersCount(): Promise<number>;

  getAdmin(): Promise<IUser | null>;
}
