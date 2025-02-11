import { IUser } from "../models/User.model";

export interface IUserService {
  registerUser(user: Partial<IUser>): void;
  getUserById(userId: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
}
