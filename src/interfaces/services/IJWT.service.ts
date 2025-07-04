import { IUser } from "../../models/User.model";

export interface IJWTService {
  /**
   * Issues new access and refresh tokens for a user. Used after login or registration to enable secure, stateless authentication.
   */
  createTokens(
    user: IUser
  ): Promise<{ accessToken: string; refreshToken: string }>;

  /**
   * Generates a new refresh token from an existing one. Used to maintain user sessions without requiring re-authentication.
   */
  getRefreshToken(token: string): Promise<string>;

  /**
   * Issues a new access token for a user. Used to refresh short-lived access without re-login.
   */
  createAccessToken(user: IUser): Promise<string>;

  /**
   * Revokes a refresh token, ending the user's session. Used for logout and security enforcement.
   */
  deleteRefreshToken(token: string): Promise<void>;
}
