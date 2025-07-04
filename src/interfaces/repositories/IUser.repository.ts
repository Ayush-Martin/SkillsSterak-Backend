import { IUser } from "../../models/User.model";
import BaseRepository from "../../repositories/Base.repository";

/**
 * Repository interface for user-related data operations.
 * Supports user management, authentication, and profile features.
 */
export interface IUserRepository extends BaseRepository<IUser> {
  /**
   * Retrieves the admin user profile.
   * Enables admin dashboard access and privileged operations.
   */
  getAdmin(): Promise<IUser | null>;

  /**
   * Retrieves users matching a search query, with pagination.
   * Supports user management, search, and directory features.
   */
  getUsers(search: RegExp, skip: number, limit: number): Promise<Array<IUser>>;

  /**
   * Retrieves a user's email address by their ID.
   * Useful for notifications, account recovery, and integrations.
   */
  getUserEmail(userId: string): Promise<string | undefined>;

  /**
   * Retrieves a user by their email address.
   * Supports authentication and account lookup flows.
   */
  getUserByEmail(email: string): Promise<IUser | null>;

  /**
   * Retrieves a user by their Google account ID.
   * Enables OAuth login and federated identity support.
   */
  getUserByGoogleId(googleId: string): Promise<IUser | null>;

  /**
   * Retrieves the block status of a user.
   * Supports access control and moderation features.
   */
  getUserBlockStatus(userId: string): Promise<{ isBlocked: boolean } | null>;

  /**
   * Returns the count of users matching a search query.
   * Enables analytics and pagination for user management.
   */
  getUsersCount(search: RegExp): Promise<number>;

  /**
   * Updates user profile fields by user ID.
   * Supports profile editing and admin management.
   */
  updateUser(userId: string, user: Partial<IUser>): Promise<IUser | null>;

  /**
   * Updates a user's password.
   * Supports password reset and security flows.
   */
  updatePassword(userId: string, password: string): Promise<IUser | null>;

  /**
   * Updates a user's profile image.
   * Enables avatar uploads and profile personalization.
   */
  updateProfileImage(
    userId: string,
    profileImage: string
  ): Promise<IUser | null>;

  /**
   * Changes a user's block status (blocked/unblocked).
   * Supports moderation and access restriction features.
   */
  changeBlockStatus(userId: string, status: boolean): Promise<IUser | null>;

  /**
   * Changes a user's premium status (premium/non-premium).
   * Enables feature gating and subscription management.
   */
  changePremiumStatus(userId: string, status: boolean): Promise<IUser | null>;

  /**
   * Updates the Stripe account ID for a user.
   * Supports payment processing and payout integrations.
   */
  updateStripeAccountId(
    userId: string,
    stripeAccountId: string
  ): Promise<IUser | null>;
}
