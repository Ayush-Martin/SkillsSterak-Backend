import { IUser } from "../../models/User.model";
export interface ITrainerService {
  /**
   * Retrieves all users with trainer status. Used to display available trainers for admin or user selection.
   */
  getAllTrainers(): Promise<Array<IUser>>;

  /**
   * Returns a paginated list of pending trainer requests. Used for admin review and onboarding workflows.
   */
  getTrainerRequest(
    page: number,
    size: number
  ): Promise<{ users: Array<IUser>; currentPage: number; totalPages: number }>;

  /**
   * Approves or rejects a user's request to become a trainer. Used to control platform quality and access.
   */
  approveRejectTrainerRequest(
    userId: string,
    status: "approved" | "rejected"
  ): Promise<void>;

  /**
   * Retrieves a paginated list of students and their enrolled courses for a trainer, with search support. Used for trainer dashboards and analytics.
   */
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

  /**
   * Fetches a trainer's profile by their unique identifier. Used for profile views and validation.
   */
  getTrainer(trainerId: string): Promise<IUser | null>;

  /**
   * Returns the total number of students for a trainer. Used for analytics and dashboard statistics.
   */
  getStudentsCount(trainerId: string): Promise<number>;
}
