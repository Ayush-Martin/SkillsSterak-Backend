import { IUserService } from "../interfaces/services/IUser.service";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { IUser } from "../models/User.model";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../constants/statusCodes";
import { ITrainerRequestRepository } from "../interfaces/repositories/ITrainerRequest.repository";
import { USER_NOT_FOUND_ERROR_MESSAGE } from "../constants/responseMessages";
import { getObjectId } from "../utils/objectId";

class UserService implements IUserService {
  constructor(
    private userRepository: IUserRepository,
    private trainerRequestRepository: ITrainerRequestRepository
  ) {}

  public async updateProfile(
    userId: string,
    updatedData: Partial<IUser>
  ): Promise<void | IUser | null> {
    const oldUserData = await this.userRepository.findById(userId);
    if (!oldUserData) {
      return errorCreator(USER_NOT_FOUND_ERROR_MESSAGE, StatusCodes.NOT_FOUND);
    }
    return await this.userRepository.updateUser(userId, updatedData);
  }

  public async updateProfileImage(
    userId: string,
    profileImage: string
  ): Promise<void> {
    await this.userRepository.updateProfileImage(userId, profileImage);
  }

  public async getUsers(
    search: string,
    page: number,
    size: number
  ): Promise<{ users: Array<IUser>; currentPage: number; totalPages: number }> {
    const searchRegex = new RegExp(search, "i");
    const skip = (page - 1) * size;
    const users = await this.userRepository.getUsers(searchRegex, skip, size);
    const totalUsers = await this.userRepository.getUsersCount(searchRegex);
    const totalPages = Math.ceil(totalUsers / size);
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
        USER_NOT_FOUND_ERROR_MESSAGE,
        StatusCodes.BAD_REQUEST
      );
    }
    await this.userRepository.changeBlockStatus(userId, !blockStatus.isBlocked);
    return !blockStatus.isBlocked;
  }

  public async sendTrainerRequest(userId: string): Promise<void> {
    const UserId = getObjectId(userId);
    await this.trainerRequestRepository.create({ userId: UserId });
  }

  public async getAdminUsersCount(): Promise<number> {
    return await this.userRepository.getUsersCount(new RegExp(""));
  }
}

export default UserService;
