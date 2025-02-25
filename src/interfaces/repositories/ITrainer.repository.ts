import { IUser } from "../../models/User.model";

export interface ITrainerRepository {
  getTrainers(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<IUser>>;
  countTrainers(search: RegExp): Promise<number>;
  changeRole(userId: string, role: "user" | "trainer"): Promise<IUser | null>;
}
