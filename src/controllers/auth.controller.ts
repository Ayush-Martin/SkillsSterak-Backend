import { NextFunction, Request, Response } from "express";
import { IUserService } from "../interfaces/IUser.service";
import { IUser } from "../models/User.model";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../utils/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { registerUserSchema } from "../validators/auth.validator";

class AuthController {
  constructor(public userService: IUserService) {}

  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username, email, password } = registerUserSchema.parse(req.body);

      const user = await this.userService.registerUser({
        username,
        email,
        password,
      });

      res
        .status(StatusCodes.CREATED)
        .json(successResponse("User created successfully", user));
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
