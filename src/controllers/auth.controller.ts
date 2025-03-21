import { NextFunction, Request, Response } from "express";
import { IAuthService } from "../interfaces/services/IAuth.service";
import { IJWTService } from "../interfaces/services/IJWT.service";
import { successResponse } from "../utils/responseCreators";
import { StatusCodes } from "../constants/statusCodes";
import errorCreator from "../utils/customError";
import {
  forgetPasswordValidator,
  loginUserValidator,
  registerUserValidator,
  resetPasswordValidator,
} from "../validators/auth.validator";
import { OTPValidator } from "../validators/OTP.validator";
import {
  COMPLETE_REGISTER_SUCCESS_MESSAGE,
  FORGET_PASSWORD_SUCCESS_MESSAGE,
  LOGIN_SUCCESS_MESSAGE,
  LOGOUT_SUCCESS_MESSAGE,
  REGISTER_SUCCESS_MESSAGE,
  RESET_PASSWORD_SUCCESS_MESSAGE,
  TOKEN_REFRESH_SUCCESS_MESSAGE,
  USER_NOT_FOUND_ERROR_MESSAGE,
  VERIFY_OTP_SUCCESS_MESSAGE,
} from "../constants/responseMessages";
import binder from "../utils/binder";
import { IGoogleAuthService } from "../interfaces/services/IGoogleAuth.service";
import envConfig from "../config/env";
import { IOTPService } from "../interfaces/services/IOTP.service";

class AuthController {
  constructor(
    public authService: IAuthService,
    public jwtService: IJWTService,
    private googleAuthService: IGoogleAuthService,
    private OTPService: IOTPService
  ) {
    binder(this);
  }

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
        .json(successResponse(REGISTER_SUCCESS_MESSAGE));
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
      const { email } = req.query as { email: string };

      await this.authService.completeRegister(email);

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(COMPLETE_REGISTER_SUCCESS_MESSAGE));
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
      if (!user) return errorCreator(USER_NOT_FOUND_ERROR_MESSAGE);
      const { accessToken, refreshToken } = await this.jwtService.createTokens(
        user
      );

      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: envConfig.REFRESH_TOKEN_EXPIRY_DAY * 24 * 60 * 60 * 1000,
        })
        .status(StatusCodes.OK)
        .json(successResponse(LOGIN_SUCCESS_MESSAGE, accessToken));
    } catch (err) {
      next(err);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .clearCookie("refreshToken", {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
        })
        .status(StatusCodes.OK)
        .json(successResponse(LOGOUT_SUCCESS_MESSAGE));
    } catch (err) {
      next(err);
    }
  }

  public async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      const { sub, email, name } = await this.googleAuthService.getUser(token);

      const user = await this.authService.googleAuth(sub, email!, name!);
      if (!user) return errorCreator(USER_NOT_FOUND_ERROR_MESSAGE);
      const { accessToken, refreshToken } = await this.jwtService.createTokens(
        user
      );

      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: envConfig.REFRESH_TOKEN_EXPIRY_DAY * 24 * 60 * 60 * 1000,
        })
        .status(StatusCodes.OK)
        .json(successResponse(LOGIN_SUCCESS_MESSAGE, accessToken));
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
        .json(successResponse(FORGET_PASSWORD_SUCCESS_MESSAGE));
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
        .json(successResponse(RESET_PASSWORD_SUCCESS_MESSAGE));
    } catch (err) {
      next(err);
    }
  }

  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.userId!;
      const user = await this.authService.getUserById(id);

      if (!user) {
        return errorCreator(USER_NOT_FOUND_ERROR_MESSAGE);
      }

      const { accessToken, refreshToken } = await this.jwtService.createTokens(
        user
      );

      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: envConfig.REFRESH_TOKEN_EXPIRY_DAY * 24 * 60 * 60 * 1000,
        })
        .status(StatusCodes.OK)
        .json(successResponse(TOKEN_REFRESH_SUCCESS_MESSAGE, accessToken));
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
