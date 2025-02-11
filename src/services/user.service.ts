import { IUserRepository } from "../interfaces/IUser.repository";
import { IUserService } from "../interfaces/IUser.service";
import { IUser } from "../models/User.model";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../utils/statusCodes";

class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  public async registerUser(user: Required<IUser>): Promise<void> {
    const userExists = await this.userRepository.getUserByEmail(user.email);
    if (userExists) {
      errorCreator("User already exists", StatusCodes.CONFLICT);
      return;
    }

    await this.userRepository.createUser(user);
  }

  public async getUserById(userId: string): Promise<IUser | null> {
    return await this.userRepository.getUserById(userId);
  }

  public async getUserByEmail(email: string): Promise<IUser | null> {
    return await this.userRepository.getUserByEmail(email);
  }
}

export default UserService;
