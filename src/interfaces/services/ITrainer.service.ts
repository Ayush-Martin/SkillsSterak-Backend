import { IUser } from "../../models/User.model";

export interface ITrainerService {
  getAllTrainers(): Promise<Array<IUser>>;
  /** Gets trainer requests */
  getTrainerRequest(
    page: number
  ): Promise<{ users: Array<IUser>; currentPage: number; totalPages: number }>;

  /** Approves or rejects a trainer request */
  approveRejectTrainerRequest(
    userId: string,
    status: "approved" | "rejected"
  ): Promise<void>;

  /** Gets students with enrolled courses */
  getStudentsWithEnrolledCourses(
    trainerId: string,
    search: string,
    page: number
  ): Promise<{
    students: Array<IUser>;
    currentPage: number;
    totalPages: number;
  }>;
}
