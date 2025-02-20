import { NextFunction, Request, response, Response } from "express";
import { StatusCodes } from "../utils/statusCodes";
import errorCreator from "../utils/customError";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.model";
import RefreshTokenModel from "../models/RefreshToken.model";
import UserRepository from "../repositories/user.repository";
import RefreshTokenRepository from "../repositories/RefreshToken.repository";
import AuthService from "../services/auth.service";
import RefreshTokenService from "../services/RefreshToken.service";
import OTPRepository from "../repositories/OTP.repository";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

const userRepository = new UserRepository(UserModel);
const otpRepository = new OTPRepository();
const refreshTokenRepository = new RefreshTokenRepository(RefreshTokenModel);
const authService = new AuthService(userRepository, otpRepository);
const refreshTokenService = new RefreshTokenService(refreshTokenRepository);

const accessTokenValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      errorCreator("Access token not found", StatusCodes.UNAUTHORIZED);
      return;
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, payload) => {
      try {
        if (err) {
          errorCreator("Invalid token", StatusCodes.UNAUTHORIZED);
        }

        const JwtPayload = payload as { _id: string };

        let userData = await authService.getUserById(JwtPayload._id);

        if (!userData) {
          return;
        }

        if (userData?.isBlocked) {
          errorCreator("you are blocked by admin", StatusCodes.FORBIDDEN);
        }

        req.userId = String(userData?._id);
        next();
      } catch (err) {
        next(err);
      }
    });
  } catch (err) {
    console.log(6);
    next(err);
  }
};

const refreshTokenValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken as string | undefined;

    if (!refreshToken) {
      errorCreator("No refresh token provided", StatusCodes.UNAUTHORIZED);
      return;
    }

    const validRefreshToken = await refreshTokenService.findToken(refreshToken);

    if (!validRefreshToken) {
      errorCreator("Invalid refresh token", StatusCodes.UNAUTHORIZED);
      return;
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, payload) => {
      try {
        if (err) {
          req.cookies.remove();
          errorCreator("invalid refresh token", StatusCodes.UNAUTHORIZED);
        }
        req.userId = payload?.sub as string;
        await refreshTokenService.deleteToken(refreshToken);
        next();
      } catch (err) {
        next(err);
      }
    });
  } catch (err) {
    next(err);
  }
};

export { accessTokenValidator, refreshTokenValidator };
