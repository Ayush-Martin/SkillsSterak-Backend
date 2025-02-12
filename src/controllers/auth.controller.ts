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
import { IOTPService } from "../interfaces/IOTP.service";
import { generateOTP } from "../utils/OTP";
import { OTPValidator } from "../validators/OTP.validator";
import { sendMail } from "../utils/mailer";

class AuthController {
  constructor(
    public userService: IUserService,
    public OTPService: IOTPService
  ) {}

  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username, email, password } = registerUserValidator(req.body);

      const hashedPassword = hashPassword(password);

      const OTP = generateOTP();

      await sendMail(email, "OTP verification", `your OTP is ${OTP}`);
      console.log("OTP", OTP);
      await this.OTPService.storeOTPAndUserData(email, 300, {
        OTP,
        username,
        email,
        password: hashedPassword,
      });

      res
        .status(StatusCodes.CREATED)
        .json(
          successResponse(
            "OTP sent to your email , verify to complete registration"
          )
        );
    } catch (err) {
      next(err);
    }
  }

  public async completeRegister(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { OTP, email } = OTPValidator(req.body);

      const storedData = await this.OTPService.getOTPAndUserData(email);

      if (!storedData) {
        return errorCreator("OTP is expired", StatusCodes.GONE);
      }

      if (OTP !== storedData.OTP) {
        return errorCreator("Invalid OTP", StatusCodes.UNAUTHORIZED);
      }

      await this.userService.registerUser({
        username: storedData.username,
        email,
        password: storedData.password,
      });

      await this.OTPService.deleteOTPAndUserData(email);

      res.status(StatusCodes.CREATED).json(successResponse("new user created"));
    } catch (err) {
      next(err);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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

      const token = generateAccessToken(user.toObject());

      res
        .status(StatusCodes.OK)
        .json(successResponse("Login successful", token));
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
