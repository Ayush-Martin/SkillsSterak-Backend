import { IJWTService } from "../interfaces/services/IJWT.service";
import { IRefreshTokenRepository } from "../interfaces/repositories/IRefreshToken.repository";
import { IUser } from "../models/User.model";
import errorCreator from "../utils/customError";
import { generateAccessToken, generateRefreshToken } from "../utils/JWT";
import { StatusCodes } from "../constants/statusCodes";
import { AuthMessage } from "../constants/responseMessages";

class JWTService implements IJWTService {
  constructor(private _refreshTokenRepository: IRefreshTokenRepository) {}

  public async createTokens(
    user: IUser
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = generateAccessToken(user.toObject());
    const refreshToken = generateRefreshToken(user.toObject());

    await this._refreshTokenRepository.create({ token: refreshToken });

    return { accessToken, refreshToken };
  }

  public async getRefreshToken(token: string): Promise<string> {
    const tokenObj = await this._refreshTokenRepository.findToken(token);
    if (!tokenObj) {
      return errorCreator(
        AuthMessage.InvalidRefreshToken,
        StatusCodes.UNAUTHORIZED
      );
    }
    return tokenObj?.token;
  }

  public async createAccessToken(user: IUser): Promise<string> {
    return generateAccessToken(user.toObject());
  }

  public async deleteRefreshToken(token: string): Promise<void> {
    await this._refreshTokenRepository.deleteToken(token);
  }
}

export default JWTService;
