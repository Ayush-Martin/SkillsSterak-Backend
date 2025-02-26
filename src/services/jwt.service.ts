import { IJWTService } from "../interfaces/services/IJWT.service";
import { IRefreshTokenRepository } from "../interfaces/IRefreshToken.repository";
import { IUser } from "../models/User.model";
import errorCreator from "../utils/customError";
import { generateAccessToken, generateRefreshToken } from "../utils/JWT";
import { StatusCodes } from "../utils/statusCodes";
import { INVALID_REFRESH_TOKEN_ERROR_MESSAGE } from "../constants/messages";

class JWTService implements IJWTService {
  constructor(private refreshTokenRepository: IRefreshTokenRepository) {}

  public async createTokens(
    user: IUser
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = generateAccessToken(user.toObject());
    const refreshToken = generateRefreshToken(user.toObject());

    await this.refreshTokenRepository.addToken(refreshToken);

    return { accessToken, refreshToken };
  }

  public async getRefreshToken(token: string): Promise<string> {
    const tokenObj = await this.refreshTokenRepository.findToken(token);
    if (!tokenObj) {
      return errorCreator(
        INVALID_REFRESH_TOKEN_ERROR_MESSAGE,
        StatusCodes.UNAUTHORIZED
      );
    }
    return tokenObj?.token;
  }

  public async createAccessToken(user: IUser): Promise<string> {
    return generateAccessToken(user.toObject());
  }

  public async deleteRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepository.deleteToken(token);
  }
}

export default JWTService;
