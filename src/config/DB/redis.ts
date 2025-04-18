import { createClient } from "redis";

export const redisClient = createClient();

redisClient.on("error", (err) => console.error("Redis Client Error", err));

/**
 * Connects to the Redis database.
 * Logs a success message if the connection is successful.
 * Logs the error if the connection fails.
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
