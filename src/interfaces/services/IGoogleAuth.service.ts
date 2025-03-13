export interface IGoogleAuthService {
  /** Get user data from google using google token*/
  getUser(token: string): Promise<{ sub: string; email: string; name: string }>;
}
