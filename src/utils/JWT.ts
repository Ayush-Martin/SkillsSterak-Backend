import { sign, verify } from "jsonwebtoken";
import { IUser } from "../models/User.model";
import errorCreator from "./customError";
import { StatusCodes } from "../constants/statusCodes";
import envConfig from "../config/env";

/**
 * Generates a JSON Web Token to use as an access token.
 * The token will include the user's id, email and other information except the password.
 * The token will expire after ACCESS_TOKEN_EXPIRY_MIN minutes.
 * @param user User object
 */
export const generateAccessToken = (user: Partial<IUser>): string => {
  return sign(
    { sub: user._id, ...user, password: undefined }, //removing password from token
    envConfig.ACCESS_TOKEN_SECRET,
    {
      expiresIn: `${envConfig.ACCESS_TOKEN_EXPIRY_MIN}m`,
    }
  );
};

/**
 * Verifies a given token.
 * @param token The token to verify
 * @returns A Promise that resolves with the payload of the token if it is valid, or rejects with an error if it is not.
 */
export const verifyToken = (token: string): Promise<any> =>
  new Promise((resolve, reject) => {
    verify(token, envConfig.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        // If the token is invalid, reject with an error
        return reject(errorCreator("Invalid token", StatusCodes.UNAUTHORIZED));
      }
      // If the token is valid, resolve with the payload
      resolve(payload);
    });
  });

export const generateRefreshToken = (user: Partial<IUser>) => {
  return sign(
    { sub: user._id, email: user.email },
    envConfig.REFRESH_TOKEN_SECRET,
    {
      expiresIn: `${envConfig.REFRESH_TOKEN_EXPIRY_DAY}d`,
    }
  );
};

/**
 * Extracts a token from an authorization header.
 * @param authHeader The authorization header. If missing or malformed, returns null.
 * @returns The extracted token, or null if the header is invalid.
 */
export const extractTokenFromHeader = (
  authHeader: string | undefined
): string | null => {
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  if (parts.length !== 2) return null;
  if (parts[0] !== "Bearer") return null;
  return parts[1];
};
