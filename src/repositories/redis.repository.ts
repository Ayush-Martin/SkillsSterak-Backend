import { IRedisRepository } from "../interfaces/repositories/IRedis.repository";
import { redisClient } from "../config/DB/redis";

class RedisRepository implements IRedisRepository {
  public async get(key: string): Promise<string | null> {
    return await redisClient.get(key);
  }

  public async setWithExpiry(
    key: string,
    expiry: number,
    value: string
  ): Promise<void> {
    await redisClient.setEx(key, expiry, value);
  }

  public async set(key: string, value: string): Promise<void> {
    await redisClient.set(key, value);
  }

  public async del(key: string): Promise<void> {
    await redisClient.del(key);
  }
}

export default RedisRepository;
