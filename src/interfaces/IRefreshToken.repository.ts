import { IRefreshToken } from "../models/RefreshToken.model";
import BaseRepository from "../repositories/Base.repository";

export interface IRefreshTokenRepository extends BaseRepository<IRefreshToken> {
  findToken(token: string): Promise<IRefreshToken | null>;
  deleteToken(token: string): Promise<void>;
}
