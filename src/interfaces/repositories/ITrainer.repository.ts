import { IUser } from "../../models/User.model";
import BaseRepository from "../../repositories/Base.repository";

export interface ITrainerRepository extends BaseRepository<IUser> {
  getTrainers(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<IUser>>;
  countTrainers(search: RegExp): Promise<number>;
  changeRole(userId: string, role: "user" | "trainer"): Promise<IUser | null>;
  getStudentsWithEnrolledCourses(
    trainerId: string,
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<IUser>>;
  getTotalStudents(trainerId: string, search: RegExp): Promise<number>;
}
