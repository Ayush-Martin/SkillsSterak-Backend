import { IUser } from "../../models/User.model";
export interface ITrainerService {
  /** Retrieves all trainers. */
  getAllTrainers(): Promise<Array<IUser>>;

  /** Retrieves trainer requests with pagination. */
  getTrainerRequest(
    page: number,
    size: number
  ): Promise<{ users: Array<IUser>; currentPage: number; totalPages: number }>;

  /** Approves or rejects a trainer request. */
  approveRejectTrainerRequest(
    userId: string,
    status: "approved" | "rejected"
  ): Promise<void>;

  /** Retrieves students with their enrolled courses for a trainer, with pagination and search. */
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

  /** Retrieves a trainer by their ID. */
  getTrainer(trainerId: string): Promise<IUser | null>;

  getStudentsCount(trainerId: string): Promise<number>;
}
