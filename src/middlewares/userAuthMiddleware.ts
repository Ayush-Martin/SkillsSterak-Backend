import { NextFunction, Request, response, Response } from "express";
import { StatusCodes } from "../utils/statusCodes";
import errorCreator from "../utils/customError";
import jwt from "jsonwebtoken";
import { IAuthService } from "../interfaces/services/IAuth.service";
import { IJWTService } from "../interfaces/services/IJWT.service";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

class UserAuthMiddleware {
  constructor(
    private authService: IAuthService,
    private jwtService: IJWTService
  ) {}

  public async accessTokenValidator(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        errorCreator("Access token not found", StatusCodes.UNAUTHORIZED);
        return;
      }

      jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, payload) => {
        try {
          if (err) {
            errorCreator("Invalid token", StatusCodes.UNAUTHORIZED);
          }

          const JwtPayload = payload as { _id: string };

          let userData = await this.authService.getUserById(JwtPayload._id);

          if (!userData) {
            return;
          }

          if (userData?.isBlocked) {
            errorCreator("you are blocked by admin", StatusCodes.FORBIDDEN);
          }

          req.userId = String(userData?._id);
          next();
        } catch (err) {
          next(err);
        }
      });
    } catch (err) {
      console.log(6);
      next(err);
    }
  }

  public async refreshTokenValidator(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const refreshToken = req.cookies.refreshToken as string | undefined;

      if (!refreshToken) {
        errorCreator("No refresh token provided", StatusCodes.UNAUTHORIZED);
        return;
      }

      const validRefreshToken = await this.jwtService.getRefreshToken(
        refreshToken
      );

      jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, payload) => {
        try {
          if (err) {
            req.cookies.remove();
            errorCreator("invalid refresh token", StatusCodes.UNAUTHORIZED);
          }
          req.userId = payload?.sub as string;
          await this.jwtService.deleteRefreshToken(refreshToken);
          next();
        } catch (err) {
          next(err);
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

export default UserAuthMiddleware;
