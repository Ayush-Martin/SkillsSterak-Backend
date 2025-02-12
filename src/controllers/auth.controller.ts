import e, { NextFunction, Request, Response } from "express";
import { IUserService } from "../interfaces/IUser.service";
import { StatusCodes } from "../utils/statusCodes";
import { successResponse } from "../utils/responseCreators";
import {
  forgetPasswordValidator,
  loginUserValidator,
  registerUserValidator,
  resetPasswordValidator,
} from "../validators/auth.validator";
import { comparePassword, hashPassword } from "../utils/password";
import errorCreator from "../utils/customError";
import { generateAccessToken, generateRefreshToken } from "../utils/JWT";
import { IOTPService } from "../interfaces/IOTP.service";
import { generateOTP } from "../utils/OTP";
import { OTPValidator } from "../validators/OTP.validator";
import { sendMail } from "../utils/mailer";

const REFRESH_TOKEN_EXPIRY_DAY =
  Number(process.env.REFRESH_TOKEN_EXPIRY_DAY) || 7;

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

      const userExist = await this.userService.getUserByEmail(email);

      if (userExist) {
        return errorCreator("Email already exists", StatusCodes.CONFLICT);
      }

      const hashedPassword = hashPassword(password);

      const OTP = generateOTP();

      await sendMail(email, "OTP verification", `your OTP is ${OTP}`);
      console.log("OTP", OTP);
      await this.OTPService.storeOTPAndRegisterData(email, 300, {
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

      const storedData = await this.OTPService.getOTPAndRegisterData(email);

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

      await this.OTPService.deleteOTPAndRegisterData(email);

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

      const accessToken = generateAccessToken(user.toObject());
      const refreshToken = generateRefreshToken(user.id, user.email);

      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: REFRESH_TOKEN_EXPIRY_DAY * 24 * 60 * 60 * 1000,
        })
        .status(StatusCodes.OK)
        .json(successResponse("Login successful", accessToken));
    } catch (err) {
      next(err);
    }
  }

  public async forgetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = forgetPasswordValidator(req.body);

      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        return errorCreator("User not exist", StatusCodes.NOT_FOUND);
      }

      const OTP = generateOTP();

      console.log("OTP", OTP);

      await sendMail(email, "OTP verification", `your OTP is ${OTP}`);

      await this.OTPService.storeOTPAndResetPasswordData(email, 300, {
        email,
        id: user.id,
        OTP,
      });

      await this.OTPService.deleteOTPAndResetPasswordData(email);

      res
        .status(StatusCodes.CREATED)
        .json(
          successResponse("OTP sent to your email , verify to reset password")
        );
    } catch (err) {
      next(err);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, email, OTP } = resetPasswordValidator(req.body);

      const storedData = await this.OTPService.getOTPAndResetPasswordData(
        email
      );

      if (!storedData) {
        return errorCreator("OTP is expired", StatusCodes.GONE);
      }

      if (OTP !== storedData.OTP) {
        return errorCreator("Invalid OTP", StatusCodes.UNAUTHORIZED);
      }

      const hashedPassword = hashPassword(password);

      await this.userService.updatePassword(storedData.id, hashedPassword);

      res
        .status(StatusCodes.ACCEPTED)
        .json(successResponse("password is updated"));
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
