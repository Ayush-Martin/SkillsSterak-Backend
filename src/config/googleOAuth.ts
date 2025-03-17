import { OAuth2Client } from "google-auth-library";
import envConfig from "./env";

const client = new OAuth2Client(envConfig.GOOGLE_CLIENT_ID);

export default client;
