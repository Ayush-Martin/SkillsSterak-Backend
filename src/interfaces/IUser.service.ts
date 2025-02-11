import { IUser } from "../models/User.model";

export interface IUserService {
  registerUser(user: Partial<IUser>): void;
}
