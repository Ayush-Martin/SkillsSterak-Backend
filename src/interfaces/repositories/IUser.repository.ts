import { IUser } from "../../models/User.model";

export interface IUserRepository {
  createUser(user: Partial<IUser>): Promise<IUser>;
  getUsers(search: RegExp, skip: number, limit: number): Promise<Array<IUser>>;
  getUserById(userId: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserByGoogleId(googleId: string): Promise<IUser | null>;
  getUserBlockStatus(userId: string): Promise<{ isBlocked: boolean } | null>;
  getUsersCount(search: RegExp): Promise<number>;
  updateUser(userId: string, user: Partial<IUser>): Promise<IUser | null>;
  updatePassword(userId: string, password: string): Promise<IUser | null>;
  updateProfileImage(
    userId: string,
    profileImage: string
  ): Promise<IUser | null>;
  changeBlockStatus(userId: string, status: boolean): Promise<IUser | null>;
  changePremiumStatus(userId: string, status: boolean): Promise<IUser | null>;
}
