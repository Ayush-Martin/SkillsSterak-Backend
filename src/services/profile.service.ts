import { IProfileService } from "../interfaces/services/IProfile.service";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { IUser } from "../models/User.model";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../utils/statusCodes";

class ProfileService implements IProfileService {
  constructor(private userRepository: IUserRepository) {}

  public async updateProfile(
    userId: string,
    user: Partial<IUser>
  ): Promise<void | IUser | null> {
    const oldUserData = await this.userRepository.getUserById(userId);
    if (!oldUserData) {
      return errorCreator("User Not found", StatusCodes.NOT_FOUND);
    }
    const updatedProfile = { ...oldUserData, ...user } as IUser;
    return await this.userRepository.updateUser(userId, updatedProfile);
  }

  public async updateProfileImage(
    userId: string,
    profileImage: string
  ): Promise<void | IUser | null> {
    return await this.updateProfileImage(userId, profileImage);
  }
}

export default ProfileService;
