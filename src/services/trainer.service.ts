import { StatusCodes } from "../constants/statusCodes";
import { ITrainerRepository } from "../interfaces/repositories/ITrainer.repository";
import { ITrainerRequestRepository } from "../interfaces/repositories/ITrainerRequest.repository";
import { ITrainerService } from "../interfaces/services/ITrainer.service";
import { ITrainerRequest } from "../models/TrainerRequest.model";
import { IUser } from "../models/User.model";
import errorCreator from "../utils/customError";

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
    trainerRequestId: string,
    status: "approved" | "rejected",
    rejectedReason?: string
  ): Promise<ITrainerRequest | null> {
    const res = await this.trainerRequestRepository.changeRequestStatus(
      trainerRequestId,
      status,
      rejectedReason
    );

    if (!res) {
      errorCreator("Trainer request not found", StatusCodes.NOT_FOUND);
      return null;
    }

    if (status == "approved") {
      await this.trainerRepository.changeRole(String(res.userId), "trainer");
    }

    return res;
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

  public async getStudentsCount(trainerId: string): Promise<number> {
    return await this.trainerRepository.getTotalStudents(
      trainerId,
      new RegExp("")
    );
  }
}

export default TrainerService;
