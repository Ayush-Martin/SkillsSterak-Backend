import { IUser } from "../../models/User.model";
import BaseRepository from "../../repositories/Base.repository";

export interface ITrainerRepository extends BaseRepository<IUser> {
  /** Gets trainers*/
  getTrainers(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<IUser>>;
  /** Gets trainer count*/
  countTrainers(search: RegExp): Promise<number>;
  /** Changes user role*/
  changeRole(userId: string, role: "user" | "trainer"): Promise<IUser | null>;
  /** Gets students with enrolled courses*/
  getStudentsWithEnrolledCourses(
    trainerId: string,
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<IUser>>;
  /** Gets total students count*/
  getTotalStudents(trainerId: string, search: RegExp): Promise<number>;
}
