import { OAuth2Client } from "google-auth-library";
import envConfig from "./env";

/**
 * Google OAuth2 client used for authentication and token verification.
 *
 * Initialized with the application's Google client ID from environment variables.
 */
const client = new OAuth2Client(envConfig.GOOGLE_CLIENT_ID);

export default client;
