import envConfig from "../config/env";
import client from "../config/googleOAuth";
import { IGoogleAuthService } from "../interfaces/services/IGoogleAuth.service";

class GoogleAuthService implements IGoogleAuthService {
  public async getUser(
    token: string
  ): Promise<{ sub: string; email: string; name: string }> {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: envConfig.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload()!;
    const { sub, email, name } = payload as {
      sub: string;
      email: string;
      name: string;
    };

    return { sub, email, name };
  }
}

export default GoogleAuthService;
