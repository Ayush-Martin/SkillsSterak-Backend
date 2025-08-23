import { createClient } from "redis";
import envConfig from "../env";

export const redisClient = createClient({
  url: envConfig.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

/**
 * Establishes a connection to the Redis server.
 *
 * Uses the configured `REDIS_URL` from environment variables.
 * Logs a success message when connected.
 * Logs an error if the connection attempt fails.
 *
 * @returns {Promise<void>} Resolves once the client is connected.
 */
const connectToRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    console.info("[Cache] Connected to Redis");
  } catch (err) {
    console.error(err);
  }
};

export default connectToRedis;
