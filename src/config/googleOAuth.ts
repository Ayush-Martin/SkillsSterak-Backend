import { OAuth2Client } from "google-auth-library";
import envConfig from "./env";

/**
 * Google OAuth2 client initialized with the application's client ID.
 */
const client = new OAuth2Client(envConfig.GOOGLE_CLIENT_ID);

export default client;
