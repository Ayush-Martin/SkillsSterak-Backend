import { IUser } from "../../models/User.model";

export interface IJWTService {
  /** Create access and refresh tokens for a user */
  createTokens(
    user: IUser
  ): Promise<{ accessToken: string; refreshToken: string }>;

  /** Retrieve a new refresh token */
  getRefreshToken(token: string): Promise<string>;

  /** Create a new access token for a user */
  createAccessToken(user: IUser): Promise<string>;

  /** Delete a refresh token */
  deleteRefreshToken(token: string): Promise<void>;
}
