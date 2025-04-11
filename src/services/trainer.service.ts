import { RECORDS_PER_PAGE } from "../constants/general";
import { ITrainerRepository } from "../interfaces/repositories/ITrainer.repository";
import { ITrainerRequestRepository } from "../interfaces/repositories/ITrainerRequest.repository";
import { ITrainerService } from "../interfaces/services/ITrainer.service";
import { IUser } from "../models/User.model";

class TrainerService implements ITrainerService {
  constructor(
    private trainerRepository: ITrainerRepository,
    private trainerRequestRepository: ITrainerRequestRepository
  ) {}

  public async getAllTrainers(): Promise<Array<IUser>> {
    return await this.trainerRepository.getAllTrainers();
  }

  public async getTrainer(trainerId: string): Promise<IUser | null> {
    return await this.trainerRepository.getTrainer(trainerId);
  }

  public async getTrainerRequest(
    page: number,
    size: number
  ): Promise<{
    users: Array<IUser>;
    currentPage: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * size;
    const users = await this.trainerRequestRepository.getRequestedUsers(
      skip,
      size
    );
    const totalUsers =
      await this.trainerRequestRepository.getRequestedUserCount();
    const totalPages = Math.ceil(totalUsers / size);

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

    if (status == "approved") {
      await this.trainerRepository.changeRole(userId, "trainer");
    }
  }

  public async getStudentsWithEnrolledCourses(
    trainerId: string,
    search: string,
    page: number,
    size: number
  ): Promise<{
    students: Array<IUser>;
    currentPage: number;
    totalPages: number;
  }> {
    const searchRegex = new RegExp(search, "i");
    const skip = (page - 1) * size;
    const students =
      await this.trainerRepository.getStudentsWithEnrolledCourses(
        trainerId,
        searchRegex,
        skip,
        size
      );
    const totalStudents = await this.trainerRepository.getTotalStudents(
      trainerId,
      searchRegex
    );
    const totalPages = Math.ceil(totalStudents / size);
    return {
      students,
      currentPage: page,
      totalPages,
    };
  }
}

export default TrainerService;
