import { ITrainerRequest } from "../../models/TrainerRequest.model";
import BaseRepository from "../../repositories/Base.repository";

export interface ITrainerRequestRepository
  extends BaseRepository<ITrainerRequest> {
  changeRequestStatus(
    userId: string,
    status: "approved" | "rejected"
  ): Promise<ITrainerRequest | null>;
  getRequestedUsers(skip: number, limit: number): Promise<any>;
  getRequestedUserCount(): Promise<number>;
}
