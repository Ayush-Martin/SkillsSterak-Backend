import mongoose from "mongoose";
import { StatusCodes } from "../constants/statusCodes";
import { ITrainerRepository } from "../interfaces/repositories/ITrainer.repository";
import { ITrainerRequestRepository } from "../interfaces/repositories/ITrainerRequest.repository";
import { ITrainerService } from "../interfaces/services/ITrainer.service";
import { ITrainerRequest } from "../models/TrainerRequest.model";
import { IUser } from "../models/User.model";
import errorCreator from "../utils/customError";

class TrainerService implements ITrainerService {
  constructor(
    private _trainerRepository: ITrainerRepository,
    private _trainerRequestRepository: ITrainerRequestRepository
  ) {}

  public async getAllTrainers(): Promise<Array<IUser>> {
    return await this._trainerRepository.getAllTrainers();
  }

  public async getTrainer(trainerId: string): Promise<IUser | null> {
    return await this._trainerRepository.getTrainer(trainerId);
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
    const users = await this._trainerRequestRepository.getRequestedUsers(
      skip,
      size
    );
    const totalUsers =
      await this._trainerRequestRepository.getRequestedUserCount();
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
    const res = await this._trainerRequestRepository.changeRequestStatus(
      trainerRequestId,
      status,
      rejectedReason
    );

    if (!res) {
      errorCreator("Trainer request not found", StatusCodes.NOT_FOUND);
      return null;
    }

    if (status == "approved") {
      await this._trainerRepository.changeRole(String(res.userId), "trainer");
    }

    return res;
  }

  public async getStudentsWithEnrolledCourses(
    trainerId: string,
    search: string,
    courseId: "all" | string,
    page: number,
    size: number
  ): Promise<{
    students: Array<IUser>;
    currentPage: number;
    totalPages: number;
  }> {
    let filter: Record<string, any> = {};
    const searchRegex = new RegExp(search, "i");
    const skip = (page - 1) * size;

    if (courseId !== "all") {
      filter["enrolledCourses.courseId"] = new mongoose.Types.ObjectId(
        courseId
      );
    }

    const students =
      await this._trainerRepository.getStudentsWithEnrolledCourses(
        trainerId,
        searchRegex,
        filter,
        skip,
        size
      );
    const totalStudents = await this._trainerRepository.getTotalStudents(
      trainerId,
      searchRegex,
      filter
    );
    const totalPages = Math.ceil(totalStudents / size);
    return {
      students,
      currentPage: page,
      totalPages,
    };
  }

  public async getStudentsCount(trainerId: string): Promise<number> {
    return await this._trainerRepository.getTotalStudents(
      trainerId,
      new RegExp(""),
      {}
    );
  }
}

export default TrainerService;
