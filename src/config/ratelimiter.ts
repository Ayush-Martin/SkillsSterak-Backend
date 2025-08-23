import rateLimit from "express-rate-limit";
import envConfig from "./env";
import { RATE_LIMIT_MESSAGE } from "../constants/general";

/**
 * Express rate limiter middleware to prevent abuse and DoS attacks.
 *
 * Configuration:
 * - `windowMs`: Time window in milliseconds for rate limiting (from env).
 * - `max`: Maximum number of requests allowed per window per IP.
 * - `message`: JSON response sent when rate limit is exceeded.
 * - `standardHeaders`: Adds RateLimit-* headers.
 * - `legacyHeaders`: Disables deprecated X-RateLimit-* headers.
 */
const limiter = rateLimit({
  windowMs: envConfig.RATELIMIT_WINDOW_MS,
  max: envConfig.RATELIMIT_MAX_REQUESTS,
  message: {
    success: false,
    message: RATE_LIMIT_MESSAGE,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiter;
