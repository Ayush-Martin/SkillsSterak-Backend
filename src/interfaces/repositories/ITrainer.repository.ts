import { IUser } from "../../models/User.model";
import BaseRepository from "../../repositories/Base.repository";

/**
 * Repository interface for trainer-related data operations.
 * Supports trainer management, student tracking, and role assignment features.
 */
export interface ITrainerRepository extends BaseRepository<IUser> {
  /**
   * Retrieves all users with the trainer role.
   * Enables admin dashboards and trainer listings.
   */
  getAllTrainers(): Promise<Array<IUser>>;

  /**
   * Retrieves trainers matching a search pattern, with pagination.
   * Supports search, filtering, and efficient trainer discovery.
   */
  getTrainers(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<IUser>>;

  /**
   * Returns the count of trainers matching a search pattern.
   * Enables analytics and pagination for trainer management.
   */
  countTrainers(search: RegExp): Promise<number>;

  /**
   * Changes a user's role between 'user' and 'trainer'.
   * Supports onboarding, promotions, and access control.
   */
  changeRole(userId: string, role: "user" | "trainer"): Promise<IUser | null>;

  /**
   * Retrieves students with enrolled courses for a specific trainer, with search and pagination.
   * Enables trainers to monitor and engage their student base.
   */
  getStudentsWithEnrolledCourses(
    trainerId: string,
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<IUser>>;

  /**
   * Retrieves the IDs of all students for a given trainer.
   * Supports messaging, analytics, and student management features.
   */
  getStudentsIds(trainerId: string): Promise<Array<string>>;

  /**
   * Returns the total number of students for a trainer, with optional search.
   * Enables trainer analytics and dashboard summaries.
   */
  getTotalStudents(trainerId: string, search: RegExp): Promise<number>;

  /**
   * Retrieves a trainer's user profile by their ID.
   * Supports profile viewing, editing, and validation.
   */
  getTrainer(trainerId: string): Promise<IUser | null>;
}
