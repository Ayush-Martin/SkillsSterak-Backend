import { NextFunction, Request, Response } from "express";
import { IUserService } from "../interfaces/IUser.service";
import { StatusCodes } from "../utils/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { registerUserSchema } from "../validators/auth.validator";
import { hashPassword } from "../utils/password";

class AuthController {
  constructor(public userService: IUserService) {}

  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username, email, password } = registerUserSchema.parse(req.body);

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
}

export default AuthController;
