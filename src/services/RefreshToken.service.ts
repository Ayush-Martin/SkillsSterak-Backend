import { IRefreshTokenService } from "../interfaces/IRefreshToken.service";
import { IRefreshToken } from "../models/RefreshToken.model";
import { IRefreshTokenRepository } from "../interfaces/IRefreshToken.repository";

class RefreshTokenService implements IRefreshTokenService {
  constructor(public RefreshTokenRepository: IRefreshTokenRepository) {}

  public async addToken(token: string): Promise<IRefreshToken> {
    return await this.RefreshTokenRepository.addToken(token);
  }

  public async findToken(token: string): Promise<IRefreshToken | null> {
    return await this.RefreshTokenRepository.findToken(token);
  }

  public async deleteToken(token: string): Promise<void> {
    return await this.RefreshTokenRepository.deleteToken(token);
  }
}

export default RefreshTokenService;
