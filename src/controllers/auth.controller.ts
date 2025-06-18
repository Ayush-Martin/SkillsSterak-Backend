import { NextFunction, Request, Response } from "express";
import { IAuthService } from "../interfaces/services/IAuth.service";
import { IJWTService } from "../interfaces/services/IJWT.service";
import { successResponse } from "../utils/responseCreators";
import { StatusCodes } from "../constants/statusCodes";
import errorCreator from "../utils/customError";
import {
  completeRegisterValidator,
  forgetPasswordValidator,
  loginUserValidator,
  registerUserValidator,
  resetPasswordValidator,
} from "../validators/auth.validator";
import {
  COMPLETE_REGISTER_SUCCESS_MESSAGE,
  FORGET_PASSWORD_SUCCESS_MESSAGE,
  LOGIN_SUCCESS_MESSAGE,
  LOGOUT_SUCCESS_MESSAGE,
  REGISTER_SUCCESS_MESSAGE,
  RESET_PASSWORD_SUCCESS_MESSAGE,
  TOKEN_REFRESH_SUCCESS_MESSAGE,
  USER_NOT_FOUND_ERROR_MESSAGE,
} from "../constants/responseMessages";
import binder from "../utils/binder";
import { IGoogleAuthService } from "../interfaces/services/IGoogleAuth.service";
import { RefreshTokenCookieOptions } from "../config/cookie";
import { REFRESH_TOKEN_COOKIE_NAME } from "../constants/general";

/** Auth controller: manages user authentication and tokens */
class AuthController {
  /** Injects authentication, JWT, and Google services */
  constructor(
    public authService: IAuthService,
    public jwtService: IJWTService,
    private googleAuthService: IGoogleAuthService
  ) {
    binder(this);
  }

  /** Register a new user */
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

  /** Complete registration after verification */
  public async completeRegister(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = completeRegisterValidator(req.query);

      await this.authService.completeRegister(email);

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(COMPLETE_REGISTER_SUCCESS_MESSAGE));
    } catch (err) {
      next(err);
    }
  }

  /** Login user and return tokens */
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
        .cookie(
          REFRESH_TOKEN_COOKIE_NAME,
          refreshToken,
          RefreshTokenCookieOptions
        )
        .status(StatusCodes.OK)
        .json(successResponse(LOGIN_SUCCESS_MESSAGE, accessToken));
    } catch (err) {
      next(err);
    }
  }

  /** Logout user and clear refresh token */
  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .clearCookie(REFRESH_TOKEN_COOKIE_NAME, RefreshTokenCookieOptions)
        .status(StatusCodes.OK)
        .json(successResponse(LOGOUT_SUCCESS_MESSAGE));
    } catch (err) {
      next(err);
    }
  }

  /** Google OAuth login or register */
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
        .cookie(
          REFRESH_TOKEN_COOKIE_NAME,
          refreshToken,
          RefreshTokenCookieOptions
        )
        .status(StatusCodes.OK)
        .json(successResponse(LOGIN_SUCCESS_MESSAGE, accessToken));
    } catch (err) {
      next(err);
    }
  }

  /** Start password reset and clear refresh token */
  public async forgetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = forgetPasswordValidator(req.body);

      await this.authService.forgetPassword(email);

      res
        .clearCookie(REFRESH_TOKEN_COOKIE_NAME, RefreshTokenCookieOptions)
        .status(StatusCodes.CREATED)
        .json(successResponse(FORGET_PASSWORD_SUCCESS_MESSAGE));
    } catch (err) {
      next(err);
    }
  }

  /** Reset user password */
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

  /** Refresh and return new tokens */
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
        .cookie(
          REFRESH_TOKEN_COOKIE_NAME,
          refreshToken,
          RefreshTokenCookieOptions
        )
        .status(StatusCodes.OK)
        .json(successResponse(TOKEN_REFRESH_SUCCESS_MESSAGE, accessToken));
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
