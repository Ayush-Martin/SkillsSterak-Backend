import { IUser } from "../../models/User.model";
import BaseRepository from "../../repositories/Base.repository";

export interface IUserRepository extends BaseRepository<IUser> {
  /** Gets admin */
  getAdmin(): Promise<IUser | null>;
  /** Gets users based on search query and pagination */
  getUsers(search: RegExp, skip: number, limit: number): Promise<Array<IUser>>;
  /** Gets user by email */
  getUserByEmail(email: string): Promise<IUser | null>;
  /** Gets user by Google Id */
  getUserByGoogleId(googleId: string): Promise<IUser | null>;
  /** Gets whether user is blocked */
  getUserBlockStatus(userId: string): Promise<{ isBlocked: boolean } | null>;
  /** Gets users count based on search query */
  getUsersCount(search: RegExp): Promise<number>;
  /** Updates user */
  updateUser(userId: string, user: Partial<IUser>): Promise<IUser | null>;
  /** Updates user's password */
  updatePassword(userId: string, password: string): Promise<IUser | null>;
  /** Updates user's profile image */
  updateProfileImage(
    userId: string,
    profileImage: string
  ): Promise<IUser | null>;
  /** Changes user's block status */
  changeBlockStatus(userId: string, status: boolean): Promise<IUser | null>;
  /** Changes user's premium status */
  changePremiumStatus(userId: string, status: boolean): Promise<IUser | null>;
}
