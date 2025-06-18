import { createClient } from "redis";

export const redisClient = createClient();

redisClient.on("error", (err) => console.error("Redis Client Error", err));

/**
 * Connects to the Redis database.
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
