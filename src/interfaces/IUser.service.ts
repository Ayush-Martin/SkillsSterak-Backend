
import { IUser } from "../models/User.model";

export interface IUserService {
  registerUser(user: Partial<IUser>): Promise<void>;
  getUserById(userId: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  updatePassword(userId: string, password: string): Promise<void>;
}
