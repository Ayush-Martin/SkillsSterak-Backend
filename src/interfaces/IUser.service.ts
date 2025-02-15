import { IUser } from "../models/User.model";

export interface IUserService {
  registerUser(user: Partial<IUser>): Promise<IUser>;
  getUserById(userId: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserByGoogleId(googleId: string): Promise<IUser | null>;
  updatePassword(userId: string, password: string): Promise<void>;
}
