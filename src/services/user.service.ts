import { IUserService } from "../interfaces/services/IUser.service";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { IUser } from "../models/User.model";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../utils/statusCodes";

class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  public async updateProfile(
    userId: string,
    { username, about }: { username: string; about: string }
  ): Promise<void | IUser | null> {
    const oldUserData = await this.userRepository.getUserById(userId);
    if (!oldUserData) {
      return errorCreator("User Not found", StatusCodes.NOT_FOUND);
    }
    return await this.userRepository.updateUser(userId, {
      username,
      about,
    });
  }

  public async updateProfileImage(
    userId: string,
    profileImage: string
  ): Promise<void> {
    await this.userRepository.updateProfileImage(userId, profileImage);
  }

  public async getUsers(
    search: string,
    page: number
  ): Promise<{ users: Array<IUser>; currentPage: number; totalPages: number }> {
    const searchRegex = new RegExp(search, "i");
    const limit = 1;
    const skip = (page - 1) * limit;
    const users = await this.userRepository.getUsers(searchRegex, skip, limit);
    const totalUsers = await this.userRepository.getUsersCount(searchRegex);
    const totalPages = Math.ceil(totalUsers / limit);
    return {
      users,
      currentPage: page,
      totalPages,
    };
  }

  public async blockUnblockUser(userId: string): Promise<boolean> {
    const blockStatus = await this.userRepository.getUserBlockStatus(userId);
    if (!blockStatus) {
      return errorCreator(
        "userId provided is not valid",
        StatusCodes.BAD_REQUEST
      );
    }
    await this.userRepository.changeBlockStatus(userId, !blockStatus.isBlocked);
    return !blockStatus.isBlocked;
  }
}

export default UserService;
