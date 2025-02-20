import { IUser } from "../../models/User.model";

export interface IProfileRepository {
  update(userId: string, user: IUser): Promise<null | IUser>;
  changeProfileImage(
    userId: string,
    profileImage: string
  ): Promise<null | IUser>;
}
