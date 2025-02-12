import { createClient } from "redis";

export const redisClient = createClient();

redisClient.on("error", (err) => console.log("Redis Client Error", err));

const connectToRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to redis");
  } catch (err) {
    console.error(err);
  }
};

export default connectToRedis;
