import { NextFunction, Request, response, Response } from "express";
import { StatusCodes } from "../constants/statusCodes";
import errorCreator from "../utils/customError";
import jwt from "jsonwebtoken";

import { extractTokenFromHeader, verifyToken } from "../utils/JWT";
import envConfig from "../config/env";
import { authService, jwtService } from "../dependencyInjector";
import { AuthMessage } from "../constants/responseMessages";

/**
 * Middleware to verify the access token sent in the Authorization header.
 */
export const accessTokenValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractTokenFromHeader(req.get("authorization"));

    if (!token) {
      return errorCreator(
        AuthMessage.InvalidAccessToken,
        StatusCodes.UNAUTHORIZED
      );
    }

    const payload = await verifyToken(token);

    const jwtPayload = payload as { _id: string };

    let userData = await authService.getUserById(jwtPayload._id);

    if (!userData) {
      return;
    }

    if (userData?.isBlocked) {
      errorCreator(AuthMessage.UserBlocked, StatusCodes.FORBIDDEN);
    }

    req.userId = String(userData?._id);
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Middleware to validate the refresh token sent in the cookie.
 * If the token is valid, it is deleted from the DB and the user ID is assigned to the request object.

 */
export const refreshTokenValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken as string | undefined;
    if (!refreshToken) {
      errorCreator(AuthMessage.InvalidAccessToken, StatusCodes.UNAUTHORIZED);
      return;
    }

    const validRefreshToken = await jwtService.getRefreshToken(refreshToken);
    if (!validRefreshToken) {
      req.cookies.remove();
      errorCreator(AuthMessage.InvalidAccessToken, StatusCodes.UNAUTHORIZED);
      return;
    }

    // Verify the refresh token using JWT and handle the result asynchronously
    jwt.verify(
      refreshToken,
      envConfig.REFRESH_TOKEN_SECRET,
      async (err, payload) => {
        try {
          // If verification fails, clear cookies and block access
          if (err) {
            req.cookies.remove();
            errorCreator(
              AuthMessage.InvalidRefreshToken,
              StatusCodes.UNAUTHORIZED
            );
          } else {
            // If valid, attach user ID to request and proceed
            req.userId = payload?.sub as string;
            next();
          }
        } catch (err) {
          // Forward any errors to the error handler
          next(err);
        }
      }
    );
  } catch (err) {
    next(err);
  }
};
