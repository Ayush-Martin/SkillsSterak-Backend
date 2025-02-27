import { IUserService } from "../interfaces/services/IUser.service";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { IUser } from "../models/User.model";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../utils/statusCodes";
import { ITrainerRequestRepository } from "../interfaces/repositories/ITrainerRequest.repository";
import { RECORDS_PER_PAGE } from "../constants/general";
import { USER_NOT_FOUND_ERROR_MESSAGE } from "../constants/responseMessages";
import mongoose from "mongoose";

class UserService implements IUserService {
  constructor(
    private userRepository: IUserRepository,
    private trainerRequestRepository: ITrainerRequestRepository
  ) {}

  public async updateProfile(
    userId: string,
    { username, about }: { username: string; about: string }
  ): Promise<void | IUser | null> {
    const oldUserData = await this.userRepository.findById(userId);
    if (!oldUserData) {
      return errorCreator(USER_NOT_FOUND_ERROR_MESSAGE, StatusCodes.NOT_FOUND);
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
    const skip = (page - 1) * RECORDS_PER_PAGE;
    const users = await this.userRepository.getUsers(
      searchRegex,
      skip,
      RECORDS_PER_PAGE
    );
    const totalUsers = await this.userRepository.getUsersCount(searchRegex);
    const totalPages = Math.ceil(totalUsers / RECORDS_PER_PAGE);
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
    const UserId = new mongoose.Schema.Types.ObjectId(userId);
    await this.trainerRequestRepository.create({ userId: UserId });
  }
}

export default UserService;
