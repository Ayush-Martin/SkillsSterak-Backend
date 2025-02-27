import { NextFunction, Request, response, Response } from "express";
import { StatusCodes } from "../utils/statusCodes";
import errorCreator from "../utils/customError";

//models
import UserModel from "../models/User.model";

//repositories
import UserRepository from "../repositories/user.repository";
import OTPRepository from "../repositories/OTP.repository";

//services
import AuthService from "../services/auth.service";
import {
  BLOCKED_ERROR_MESSAGE,
  INVALID_ACCESS_TOKEN_ERROR_MESSAGE,
  NO_ACCESS_ERROR_MESSAGE,
} from "../constants/responseMessages";
import { extractTokenFromHeader, verifyToken } from "../utils/JWT";
import mongoose from "mongoose";

const userRepository = new UserRepository(UserModel);
const otpRepository = new OTPRepository();

const authService = new AuthService(userRepository, otpRepository);

export const trainerAuthMiddleware = async (
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

    if (userData.role != "trainer") {
      errorCreator(NO_ACCESS_ERROR_MESSAGE, StatusCodes.FORBIDDEN);
    }

    req.userId = userData?._id as string;
    next();
  } catch (err) {
    next(err);
  }
};
