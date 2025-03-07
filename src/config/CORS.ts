import cors, { CorsOptions } from "cors";
import { config } from "dotenv";

config();
const FRONTEND_DOMAIN = process.env.FRONTEND_DOMAIN || "http://localhost:4000";

const corsOptions: CorsOptions = {
  origin: FRONTEND_DOMAIN,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default cors(corsOptions);
