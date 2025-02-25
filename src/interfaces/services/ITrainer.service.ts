
import { IUser } from "../../models/User.model";

export interface ITrainerService {
  //   getTrainers(
  //     search: string,
  //     page: number
  //   ): Promise<{
  //     trainers: Array<IUser>;
  //     currentPage: number;
  //     totalPages: number;
  //   }>;

  getTrainerRequest(
    page: number
  ): Promise<{ users: Array<IUser>; currentPage: number; totalPages: number }>;

  //   countTrainers(search: string): Promise<number>;

  approveRejectTrainerRequest(
    userId: string,
    status: "approved" | "rejected"
  ): Promise<void>;
}
