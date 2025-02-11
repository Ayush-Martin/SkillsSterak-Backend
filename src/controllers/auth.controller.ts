import { NextFunction, Request, Response } from "express";
import { IUserService } from "../interfaces/IUser.service";
import { StatusCodes } from "../utils/statusCodes";
import { successResponse } from "../utils/responseCreators";
import {
  loginUserValidator,
  registerUserValidator,
} from "../validators/auth.validator";
import { comparePassword, hashPassword } from "../utils/password";
import errorCreator from "../utils/customError";
import { generateAccessToken } from "../utils/JWT";

class AuthController {
  constructor(public userService: IUserService) {}

  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username, email, password } = registerUserValidator(req.body);

      const hashedPassword = hashPassword(password);

      const user = await this.userService.registerUser({
        username,
        email,
        password: hashedPassword,
      });

      res
        .status(StatusCodes.CREATED)
        .json(successResponse("User created successfully", user));
    } catch (err) {
      next(err);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = loginUserValidator(req.body);

      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        errorCreator("User not found", StatusCodes.NOT_FOUND);
        return;
      }

      const isPasswordValid = comparePassword(password, user.password);

      if (!isPasswordValid) {
        errorCreator("Invalid credentials", StatusCodes.UNAUTHORIZED);
        return;
      }

      const token = generateAccessToken({ ...user, password: undefined });

      res
        .status(StatusCodes.OK)
        .json(successResponse("Login successful", token));
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
