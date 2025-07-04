export interface IGoogleAuthService {
  /**
   * Retrieves user profile information from Google using an OAuth token. Used to authenticate users and link Google accounts.
   */
  getUser(token: string): Promise<{ sub: string; email: string; name: string }>;
}
