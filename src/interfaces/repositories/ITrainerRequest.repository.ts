import { ITrainerRequest } from "../../models/TrainerRequest.model";
import BaseRepository from "../../repositories/Base.repository";

/**
 * Repository interface for trainer request operations.
 * Supports onboarding, approval workflows, and request management for trainers.
 */
export interface ITrainerRequestRepository
  extends BaseRepository<ITrainerRequest> {
  /**
   * Changes the status of a trainer request (e.g., approve or reject).
   * Enables admin workflows for managing trainer applications.
   */
  changeRequestStatus(
    trainerRequestId: string,
    status: "approved" | "rejected",
    rejectedReason?: string
  ): Promise<ITrainerRequest | null>;

  /**
   * Retrieves users who have requested trainer status, with pagination.
   * Supports review queues and admin dashboards.
   */
  getRequestedUsers(skip: number, limit: number): Promise<any>;

  /**
   * Returns the total count of users who have requested trainer status.
   * Enables analytics and pagination for request management.
   */
  getRequestedUserCount(): Promise<number>;

  getUserPreviousRequestDetails(
    userId: string
  ): Promise<ITrainerRequest | null>;
}
