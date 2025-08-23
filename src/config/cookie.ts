import { CookieOptions } from "express";
import envConfig from "./env";

/**
 * Configuration options for storing the refresh token in a cookie.
 *
 * - `httpOnly`: Prevents client-side JavaScript from accessing the cookie.
 * - `secure`: Ensures the cookie is sent over HTTPS in production.
 * - `sameSite`: Restricts cross-site sending of the cookie.
 * - `maxAge`: Duration in milliseconds before the cookie expires (calculated from REFRESH_TOKEN_EXPIRY_DAY).
 */
export const RefreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: envConfig.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: envConfig.REFRESH_TOKEN_EXPIRY_DAY * 24 * 60 * 60 * 1000, // Convert days to milliseconds
};
