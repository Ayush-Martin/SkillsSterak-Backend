import { IRefreshToken } from "../../models/RefreshToken.model";
import BaseRepository from "../../repositories/Base.repository";

export interface IRefreshTokenRepository extends BaseRepository<IRefreshToken> {
  /** Finds a refresh token by token string */
  findToken(token: string): Promise<IRefreshToken | null>;
  /** Deletes a refresh token by token string */
  deleteToken(token: string): Promise<void>;
}
