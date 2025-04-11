import { IUser } from "../../models/User.model";
export interface ITrainerService {
  getAllTrainers(): Promise<Array<IUser>>;

  getTrainerRequest(
    page: number,
    size: number
  ): Promise<{ users: Array<IUser>; currentPage: number; totalPages: number }>;

  approveRejectTrainerRequest(
    userId: string,
    status: "approved" | "rejected"
  ): Promise<void>;

  getStudentsWithEnrolledCourses(
    trainerId: string,
    search: string,
    page: number,
    size: number
  ): Promise<{
    students: Array<IUser>;
    currentPage: number;
    totalPages: number;
  }>;

  getTrainer(trainerId: string): Promise<IUser | null>;
}
