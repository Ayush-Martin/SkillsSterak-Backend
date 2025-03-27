import { IRefreshToken } from "../models/RefreshToken.model";
import { IRefreshTokenRepository } from "../interfaces/repositories/IRefreshToken.repository";
import { Model } from "mongoose";
import BaseRepository from "./Base.repository";

class RefreshTokenRepository
  extends BaseRepository<IRefreshToken>
  implements IRefreshTokenRepository
{
  constructor(public RefreshToken: Model<IRefreshToken>) {
    super(RefreshToken);
  }

  public async deleteToken(token: string): Promise<void> {
    await this.RefreshToken.deleteOne({ token });
  }

  public async findToken(token: string): Promise<IRefreshToken | null> {
    
    return await this.RefreshToken.findOne({ token });
  }
}

export default RefreshTokenRepository;
