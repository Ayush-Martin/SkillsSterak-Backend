import { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { IAuthService } from "../interfaces/IAuth.service";
import { StatusCodes } from "../utils/statusCodes";
import { successResponse } from "../utils/responseCreators";
import {
  forgetPasswordValidator,
  loginUserValidator,
  registerUserValidator,
  resetPasswordValidator,
} from "../validators/auth.validator";
import errorCreator from "../utils/customError";
import { generateAccessToken, generateRefreshToken } from "../utils/JWT";
import { OTPValidator } from "../validators/OTP.validator";
import { IRefreshTokenService } from "../interfaces/IRefreshToken.service";

const REFRESH_TOKEN_EXPIRY_DAY =
  Number(process.env.REFRESH_TOKEN_EXPIRY_DAY) || 7;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

class AuthController {
  constructor(
    public authService: IAuthService,
    public RefreshTokenService: IRefreshTokenService
  ) {}

  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username, email, password } = registerUserValidator(req.body);

      await this.authService.register(username, email, password);

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

      this.authService.completeRegister(OTP, email);

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

      const user = await this.authService.login(email, password)!;
      if (!user) return errorCreator("No user found");
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
      const user = await this.authService.googleAuth(sub, email!, name!);
      if (!user) return errorCreator("No user found");
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

      await this.authService.forgetPassword(email);

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

      await this.authService.verifyOTP(OTP, email);

      res.status(StatusCodes.ACCEPTED).json(successResponse("OTP is verified"));
    } catch (err) {
      next(err);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, email } = resetPasswordValidator(req.body);

      await this.authService.resetPassword(email, password);

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
      const user = await this.authService.getUserById(id);

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
