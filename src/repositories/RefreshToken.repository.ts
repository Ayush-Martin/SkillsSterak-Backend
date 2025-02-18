import { IRefreshToken } from "../models/RefreshToken.model";
import { IRefreshTokenRepository } from "../interfaces/IRefreshToken.repository";
import { Model } from "mongoose";

class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(public RefreshToken: Model<IRefreshToken>) {}

  public async addToken(token: string): Promise<IRefreshToken> {
    const refreshToken = new this.RefreshToken({ token });
    await refreshToken.save();
    return refreshToken;
  }

  public async deleteToken(token: string): Promise<void> {
    await this.RefreshToken.deleteOne({ token });
  }

  public async findToken(token: string): Promise<IRefreshToken | null> {
    return await this.RefreshToken.findOne({ token });
  }
}

export default RefreshTokenRepository;
