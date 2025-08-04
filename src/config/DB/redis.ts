import { createClient } from "redis";
import envConfig from "../env";

export const redisClient = createClient({
  url: "redis://redis:6379",
});

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
