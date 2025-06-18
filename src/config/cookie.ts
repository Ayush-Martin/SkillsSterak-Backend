import { CookieOptions } from "express";
import envConfig from "./env";

/** Cookie options for storing the refresh token securely */
export const RefreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: envConfig.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: envConfig.REFRESH_TOKEN_EXPIRY_DAY * 24 * 60 * 60 * 1000, // Convert days to milliseconds
};
