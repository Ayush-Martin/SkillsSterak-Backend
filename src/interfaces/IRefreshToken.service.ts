import { IRefreshToken } from "../models/RefreshToken.model";

export interface IRefreshTokenService {
  addToken(token: string): Promise<IRefreshToken>;
  findToken(token: string): Promise<IRefreshToken | null>;
  deleteToken(token: string): Promise<void>;
}
