import cors, { CorsOptions } from "cors";
import envConfig from "./env";

/**
 * CORS options for the application.
 */
export const corsOptions: CorsOptions = {
  origin: envConfig.FRONTEND_DOMAIN,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default cors(corsOptions);
