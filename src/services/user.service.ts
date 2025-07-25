import { IUserService } from "../interfaces/services/IUser.service";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { IUser } from "../models/User.model";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../constants/statusCodes";
import { ITrainerRequestRepository } from "../interfaces/repositories/ITrainerRequest.repository";
import { getObjectId } from "../utils/objectId";
import { UserMessage } from "../constants/responseMessages";
import { ITrainerRequest } from "../models/TrainerRequest.model";

class UserService implements IUserService {
  constructor(
    private _userRepository: IUserRepository,
    private _trainerRequestRepository: ITrainerRequestRepository
  ) {}

  public async getProfile(userId: string): Promise<IUser | null> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      return errorCreator(UserMessage.UserNotFound, StatusCodes.NOT_FOUND);
    }
    return user;
  }

  public async updateProfile(
    userId: string,
    updatedData: Partial<IUser>
  ): Promise<void | IUser | null> {
    const oldUserData = await this._userRepository.findById(userId);
    if (!oldUserData) {
      return errorCreator(UserMessage.UserNotFound, StatusCodes.NOT_FOUND);
    }
    return await this._userRepository.updateUser(userId, updatedData);
  }

  public async updateProfileImage(
    userId: string,
    profileImage: string
  ): Promise<void> {
    await this._userRepository.updateProfileImage(userId, profileImage);
  }

  public async getUsers(
    search: string,
    page: number,
    size: number
  ): Promise<{ users: Array<IUser>; currentPage: number; totalPages: number }> {
    const searchRegex = new RegExp(search, "i");
    const skip = (page - 1) * size;
    const users = await this._userRepository.getUsers(searchRegex, skip, size);
    const totalUsers = await this._userRepository.getUsersCount(searchRegex);
    const totalPages = Math.ceil(totalUsers / size);
    return {
      users,
      currentPage: page,
      totalPages,
    };
  }

  public async blockUnblockUser(userId: string): Promise<boolean> {
    const blockStatus = await this._userRepository.getUserBlockStatus(userId);
    if (!blockStatus) {
      return errorCreator(UserMessage.UserNotFound, StatusCodes.BAD_REQUEST);
    }
    await this._userRepository.changeBlockStatus(userId, !blockStatus.isBlocked);
    return !blockStatus.isBlocked;
  }

  public async sendTrainerRequest(userId: string): Promise<void> {
    const UserId = getObjectId(userId);
    await this._trainerRequestRepository.create({ userId: UserId });
  }

  public async getAdminUsersCount(): Promise<number> {
    return await this._userRepository.getUsersCount(new RegExp(""));
  }

  public async getAdmin(): Promise<IUser | null> {
    return await this._userRepository.getAdmin();
  }

  public async checkCompleteProfile(userId: string): Promise<boolean> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      return errorCreator(UserMessage.UserNotFound, StatusCodes.BAD_REQUEST);
    }

    const {
      username,
      bio,
      socialLinks,
      profileImage,
      location,
      company,
      education,
      skills,
      experiences,
      position,
    } = user;

    const hasOneLink = socialLinks && Object.values(socialLinks).some((x) => x);

    const isComplete = !!(
      username &&
      bio &&
      profileImage &&
      location &&
      company &&
      education &&
      skills?.length &&
      experiences?.length &&
      position &&
      hasOneLink
    );

    return isComplete;
  }

  public async getPreviousTrainerRequestDetails(
    userId: string
  ): Promise<ITrainerRequest | null> {
    return await this._trainerRequestRepository.getUserPreviousRequestDetails(
      userId
    );
  }

  public async getUserProfileDetails(userId: string): Promise<IUser | null> {
    return await this._userRepository.getUserProfileDetails(userId);
  }
}

export default UserService;
