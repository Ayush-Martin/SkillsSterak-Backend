import cors, { CorsOptions } from "cors";
import envConfig from "./env";

/**
 * Configuration options for Cross-Origin Resource Sharing (CORS).
 *
 * - `origin`: Specifies the allowed origin(s) for requests.
 * - `credentials`: Enables cookies and authorization headers to be sent.
 * - `allowedHeaders`: Specifies which headers can be sent in requests.
 */
export const corsOptions: CorsOptions = {
  origin: envConfig.FRONTEND_DOMAIN,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default cors(corsOptions);
