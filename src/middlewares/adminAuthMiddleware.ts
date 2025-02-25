import { NextFunction, Request, response, Response } from "express";
import { StatusCodes } from "../utils/statusCodes";
import errorCreator from "../utils/customError";
import jwt from "jsonwebtoken";

//models
import UserModel from "../models/User.model";

//repositories
import UserRepository from "../repositories/user.repository";
import OTPRepository from "../repositories/OTP.repository";

//services
import AuthService from "../services/auth.service";

const userRepository = new UserRepository(UserModel);
const otpRepository = new OTPRepository();

const authService = new AuthService(userRepository, otpRepository);

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const adminAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      errorCreator("Invalid token", StatusCodes.UNAUTHORIZED);
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

        if (userData.role != "admin") {
          errorCreator("you are not admin", StatusCodes.FORBIDDEN);
        }

        req.userId = String(userData?._id);
        next();
      } catch (err) {
        next(err);
      }
    });
  } catch (err) {
    next(err);
  }
};
