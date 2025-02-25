import { ITrainerRepository } from "../interfaces/repositories/ITrainer.repository";
import { ITrainerRequestRepository } from "../interfaces/repositories/ITrainerRequest.repository";
import { ITrainerService } from "../interfaces/services/ITrainer.service";
import { IUser } from "../models/User.model";

class TrainerService implements ITrainerService {
  constructor(
    private trainerRepository: ITrainerRepository,
    private trainerRequestRepository: ITrainerRequestRepository
  ) {}

  public async getTrainerRequest(page: number): Promise<{
    users: Array<IUser>;
    currentPage: number;
    totalPages: number;
  }> {
    const limit = 1;
    const skip = (page - 1) * limit;
    const users = await this.trainerRequestRepository.getRequestedUsers(
      skip,
      limit
    );
    const totalUsers =
      await this.trainerRequestRepository.getRequestedUserCount();
    const totalPages = Math.ceil(totalUsers / limit);

    return {
      users: users,
      currentPage: page,
      totalPages,
    };
  }

  public async approveRejectTrainerRequest(
    userId: string,
    status: "approved" | "rejected"
  ): Promise<void> {
    const res = await this.trainerRequestRepository.changeRequestStatus(
      userId,
      status
    );
    console.log(res);

    if (status == "approved") {
      await this.trainerRepository.changeRole(userId, "trainer");
    }
  }
}

export default TrainerService;
