import { NextFunction, Request, response, Response } from "express";
import { StatusCodes } from "../constants/statusCodes";
import errorCreator from "../utils/customError";
import jwt from "jsonwebtoken";

//models
import UserModel from "../models/User.model";
import RefreshTokenModel from "../models/RefreshToken.model";

//repositories
import UserRepository from "../repositories/user.repository";
import OTPRepository from "../repositories/OTP.repository";
import RefreshTokenRepository from "../repositories/RefreshToken.repository";

//services
import AuthService from "../services/auth.service";
import JWTService from "../services/jwt.service";
import {
  BLOCKED_ERROR_MESSAGE,
  INVALID_ACCESS_TOKEN_ERROR_MESSAGE,
  INVALID_REFRESH_TOKEN_ERROR_MESSAGE,
} from "../constants/responseMessages";
import { extractTokenFromHeader, verifyToken } from "../utils/JWT";
import envConfig from "../config/env";

const userRepository = new UserRepository(UserModel);
const otpRepository = new OTPRepository();
const refreshTokenRepository = new RefreshTokenRepository(RefreshTokenModel);

const authService = new AuthService(userRepository, otpRepository);
const jwtService = new JWTService(refreshTokenRepository);

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
        INVALID_ACCESS_TOKEN_ERROR_MESSAGE,
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
      errorCreator(BLOCKED_ERROR_MESSAGE, StatusCodes.FORBIDDEN);
    }

    req.userId = userData?._id as string;
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
      errorCreator(
        INVALID_REFRESH_TOKEN_ERROR_MESSAGE,
        StatusCodes.UNAUTHORIZED
      );
      return;
    }

    const validRefreshToken = await jwtService.getRefreshToken(refreshToken);
    if (!validRefreshToken) {
      req.cookies.remove();
      errorCreator(
        INVALID_REFRESH_TOKEN_ERROR_MESSAGE,
        StatusCodes.UNAUTHORIZED
      );
      return;
    }

    jwt.verify(
      refreshToken,
      envConfig.REFRESH_TOKEN_SECRET,
      async (err, payload) => {
        try {
          if (err) {
            req.cookies.remove();
            errorCreator(
              INVALID_REFRESH_TOKEN_ERROR_MESSAGE,
              StatusCodes.UNAUTHORIZED
            );
          } else {
            req.userId = payload?.sub as string;
            await jwtService.deleteRefreshToken(refreshToken);
            next();
          }
        } catch (err) {
          next(err);
        }
      }
    );
  } catch (err) {
    next(err);
  }
};
