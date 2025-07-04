import { IRefreshToken } from "../../models/RefreshToken.model";
import BaseRepository from "../../repositories/Base.repository";

/**
 * Repository interface for refresh token operations.
 * Supports secure session management and token lifecycle control.
 */
export interface IRefreshTokenRepository extends BaseRepository<IRefreshToken> {
  /**
   * Finds a refresh token by its token string.
   * Enables validation and detection of token reuse or compromise.
   */
  findToken(token: string): Promise<IRefreshToken | null>;

  /**
   * Deletes a refresh token by its token string.
   * Supports logout, token rotation, and session invalidation.
   */
  deleteToken(token: string): Promise<void>;
}
