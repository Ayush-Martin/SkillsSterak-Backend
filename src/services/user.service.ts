import { ObjectId } from "mongoose";
import { IUserRepository } from "../interfaces/IUser.repository";
import { IUserService } from "../interfaces/IUser.service";
import { IUser } from "../models/User.model";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../utils/statusCodes";

class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  public async registerUser(user: Partial<IUser>): Promise<IUser> {
    const userExist = await this.userRepository.getUserByEmail(user.email!);
    if (userExist)
      return errorCreator("User exist already", StatusCodes.CONFLICT);
    return await this.userRepository.createUser(user);
  }

  public async getUserById(userId: string): Promise<IUser | null> {
    return await this.userRepository.getUserById(userId);
  }

  public async getUserByEmail(email: string): Promise<IUser | null> {
    return await this.userRepository.getUserByEmail(email);
  }

  public async getUserByGoogleId(googleId: string): Promise<IUser | null> {
    return await this.userRepository.getUserByGoogleId(googleId);
  }

  public async updatePassword(userId: string, password: string): Promise<void> {
    await this.userRepository.updatePassword(userId, password);
  }
}

export default UserService;
