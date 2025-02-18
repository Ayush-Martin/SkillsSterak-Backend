import { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
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
import { IRefreshTokenService } from "../interfaces/IRefreshToken.service";

const REFRESH_TOKEN_EXPIRY_DAY =
  Number(process.env.REFRESH_TOKEN_EXPIRY_DAY) || 7;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

class AuthController {
  constructor(
    public userService: IUserService,
    public OTPService: IOTPService,
    public RefreshTokenService: IRefreshTokenService
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

      const isPasswordValid = comparePassword(password, user.password!);

      if (!isPasswordValid) {
        errorCreator("Invalid credentials", StatusCodes.UNAUTHORIZED);
        return;
      }

      const accessToken = generateAccessToken(user.toObject());
      const refreshToken = generateRefreshToken(user.toObject());

      await this.RefreshTokenService.addToken(refreshToken);

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

  public async logout(req: Request, res: Response, next: NextFunction) {
    res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      })
      .status(StatusCodes.OK)
      .json(successResponse("user is logged out"));
  }

  public async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload()!;

      const { sub, email, name } = payload;
      let user = await this.userService.getUserByGoogleId(payload?.sub);

      if (!user) {
        user = await this.userService.registerUser({
          googleId: sub,
          email,
          username: name,
        });
      }

      const accessToken = generateAccessToken(user.toObject());
      const refreshToken = generateRefreshToken(user);
      await this.RefreshTokenService.addToken(refreshToken);

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
        isVerified: false,
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

  public async verifyOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { OTP, email } = OTPValidator(req.body);

      const storedData = await this.OTPService.getOTPAndResetPasswordData(
        email
      );

      if (!storedData) {
        return errorCreator("OTP is expired", StatusCodes.GONE);
      }

      if (OTP !== storedData.OTP) {
        return errorCreator("Invalid OTP", StatusCodes.UNAUTHORIZED);
      }

      await this.OTPService.storeOTPAndResetPasswordData(email, 300, {
        email,
        OTP,
        isVerified: true,
        id: storedData.id,
      });

      res.status(StatusCodes.ACCEPTED).json(successResponse("OTP is verified"));
    } catch (err) {
      next(err);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, email } = resetPasswordValidator(req.body);

      const storedData = await this.OTPService.getOTPAndResetPasswordData(
        email
      );

      if (!storedData) {
        return errorCreator("OTP is expired", StatusCodes.GONE);
      }

      if (!storedData.isVerified) {
        return errorCreator("OTP is not verified", StatusCodes.UNAUTHORIZED);
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

  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.userId!;
      console.log("id", id);
      const user = await this.userService.getUserById(id);

      if (!user) {
        return errorCreator("user not found");
      }

      const accessToken = generateAccessToken(user.toObject());
      const refreshToken = generateRefreshToken(user.toObject());

      await this.RefreshTokenService.addToken(refreshToken);

      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: REFRESH_TOKEN_EXPIRY_DAY * 24 * 60 * 60 * 1000,
        })
        .status(StatusCodes.OK)
        .json(successResponse("Token refreshed", accessToken));
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
