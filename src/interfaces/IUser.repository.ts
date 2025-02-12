import { IUser } from "../models/User.model";

export interface IUserRepository {
  createUser(user: Partial<IUser>): Promise<IUser>;
  getUserById(userId: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  updateUser(userId: string, user: IUser): Promise<IUser | null>;
  updatePassword(userId: string, password: string): Promise<IUser | null>;
  changeBlockStatus(userId: string, status: boolean): Promise<IUser | null>;
  changeTrainerStatus(userId: string, status: boolean): Promise<IUser | null>;
  changePremiumStatus(userId: string, status: boolean): Promise<IUser | null>;
}
