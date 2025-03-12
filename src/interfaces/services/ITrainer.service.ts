import { IUser } from "../../models/User.model";

export interface ITrainerService {
  getTrainerRequest(
    page: number
  ): Promise<{ users: Array<IUser>; currentPage: number; totalPages: number }>;

  approveRejectTrainerRequest(
    userId: string,
    status: "approved" | "rejected"
  ): Promise<void>;

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
