import { IRefreshToken } from "../models/RefreshToken.model";

export interface IRefreshTokenRepository {
  addToken(token: string): Promise<IRefreshToken>;
  findToken(token: string): Promise<IRefreshToken | null>;
  deleteToken(token: string): Promise<void>;
}
