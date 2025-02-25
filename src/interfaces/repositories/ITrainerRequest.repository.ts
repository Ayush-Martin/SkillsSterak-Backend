import { ITrainerRequest } from "../../models/TrainerRequest.model";

export interface ITrainerRequestRepository {
  addTrainerRequest(userId: string): Promise<ITrainerRequest | null>;
  changeRequestStatus(
    userId: string,
    status: "approved" | "rejected"
  ): Promise<ITrainerRequest | null>;
  getRequestedUsers(skip: number, limit: number): Promise<any>;
  getRequestedUserCount(): Promise<number>;
}
