import { ITrainerRequest } from "../../models/TrainerRequest.model";
import BaseRepository from "../../repositories/Base.repository";

export interface ITrainerRequestRepository
  extends BaseRepository<ITrainerRequest> {
  /** Changes request status */
  changeRequestStatus(
    userId: string,
    status: "approved" | "rejected"
  ): Promise<ITrainerRequest | null>;
  /** Gets requested users */
  getRequestedUsers(skip: number, limit: number): Promise<any>;
  /** Gets total requested users count */
  getRequestedUserCount(): Promise<number>;
}
