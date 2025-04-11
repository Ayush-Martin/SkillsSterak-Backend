import { NextFunction, Request, response, Response } from "express";
import { StatusCodes } from "../constants/statusCodes";
import errorCreator from "../utils/customError";

//services
import {
  BLOCKED_ERROR_MESSAGE,
  INVALID_ACCESS_TOKEN_ERROR_MESSAGE,
  NO_ACCESS_ERROR_MESSAGE,
} from "../constants/responseMessages";
import { extractTokenFromHeader, verifyToken } from "../utils/JWT";
import OTPService from "../services/OTP.service";
import { authService } from "../dependencyInjector";

/**
 * Middleware to authenticate trainer users.
 * Verifies the access token from the request header and checks if the user is a trainer.
 */
export const trainerAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
