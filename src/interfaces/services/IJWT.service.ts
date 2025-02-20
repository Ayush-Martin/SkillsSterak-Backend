import { IUser } from "../../models/User.model";

export interface IJWTService {
  createTokens(
    user: IUser
  ): Promise<{ accessToken: string; refreshToken: string }>;
  getRefreshToken(token: string): Promise<string>;
  createAccessToken(user: IUser): Promise<string>;
  deleteRefreshToken(token: string): Promise<void>;
}
