import { NextFunction, Request, Response } from "express";
import { IAuthService } from "../interfaces/services/IAuth.service";
import { IJWTService } from "../interfaces/services/IJWT.service";
import { successResponse } from "../utils/responseCreators";
import { StatusCodes } from "../constants/statusCodes";
import errorCreator from "../utils/customError";
import {
  changePasswordValidator,
  completeRegisterValidator,
  forgetPasswordValidator,
  loginUserValidator,
  registerUserValidator,
  resetPasswordValidator,
} from "../validators/user.validator";
import binder from "../utils/binder";
import { IGoogleAuthService } from "../interfaces/services/IGoogleAuth.service";
import { RefreshTokenCookieOptions } from "../config/cookie";
import { REFRESH_TOKEN_COOKIE_NAME } from "../constants/general";
import { AuthMessage, UserMessage } from "../constants/responseMessages";

class AuthController {
  constructor(
    public _authService: IAuthService,
    public _jwtService: IJWTService,
    private _googleAuthService: IGoogleAuthService
  ) {
    binder(this);
  }

  // First step of user registration , sends an OTP to the user's email and store user details
  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username, email, password } = registerUserValidator(req.body);

      await this._authService.register(username, email, password);

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(AuthMessage.RegisterOtpSent));
    } catch (err) {
      next(err);
    }
  }

  // Completes registration after email verification. 
  public async completeRegister(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = completeRegisterValidator(req.query);

      await this._authService.completeRegister(email);

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(AuthMessage.UserRegistered));
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

      const user = await this._authService.login(email, password)!;
      if (!user) return errorCreator(UserMessage.UserNotFound);
      const { accessToken, refreshToken } = await this._jwtService.createTokens(
        user
      );

      res
        .cookie(
          REFRESH_TOKEN_COOKIE_NAME,
          refreshToken,
          RefreshTokenCookieOptions
        )
        .status(StatusCodes.OK)
        .json(successResponse(AuthMessage.UserLoggedIn, accessToken));
    } catch (err) {
      next(err);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .clearCookie(REFRESH_TOKEN_COOKIE_NAME, RefreshTokenCookieOptions)
        .status(StatusCodes.OK)
        .json(successResponse(AuthMessage.UserLoggedOut));
    } catch (err) {
      next(err);
    }
  }

  // Handles Google OAuth login or registration.
  public async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      const { sub, email, name } = await this._googleAuthService.getUser(token);

      const user = await this._authService.googleAuth(sub, email!, name!);
      if (!user) return errorCreator(UserMessage.UserNotFound);
      const { accessToken, refreshToken } = await this._jwtService.createTokens(
        user
      );

      res
        .cookie(
          REFRESH_TOKEN_COOKIE_NAME,
          refreshToken,
          RefreshTokenCookieOptions
        )
        .status(StatusCodes.OK)
        .json(successResponse(AuthMessage.UserLoggedIn, accessToken));
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

      await this._authService.forgetPassword(email);

      res
        .clearCookie(REFRESH_TOKEN_COOKIE_NAME, RefreshTokenCookieOptions)
        .status(StatusCodes.CREATED)
        .json(successResponse(AuthMessage.ForgetPasswordOtpSent));
    } catch (err) {
      next(err);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, email } = resetPasswordValidator(req.body);

      await this._authService.resetPassword(email, password);

      res
        .status(StatusCodes.ACCEPTED)
        .json(successResponse(AuthMessage.PasswordReset));
    } catch (err) {
      next(err);
    }
  }

  public async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;

      const { currentPassword, newPassword } = changePasswordValidator(
        req.body
      );

      await this._authService.changePassword(
        userId,
        currentPassword,
        newPassword
      );

      res
        .status(StatusCodes.ACCEPTED)
        .json(successResponse(AuthMessage.PasswordReset));
    } catch (err) {
      next(err);
    }
  }

  // Refreshes and returns new access and refresh tokens.
  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const user = await this._authService.getUserById(userId);

      if (!user) {
        return errorCreator(UserMessage.UserNotFound);
      }

      const { accessToken, refreshToken } = await this._jwtService.createTokens(
        user
      );

      res
        .cookie(
          REFRESH_TOKEN_COOKIE_NAME,
          refreshToken,
          RefreshTokenCookieOptions
        )
        .status(StatusCodes.OK)
        .json(successResponse(AuthMessage.TokenRefreshed, accessToken));
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
