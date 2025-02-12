import { IOTPRepository } from "../interfaces/IOTP.repository";
import { redisClient } from "../config/DB/redis";

class OTPRepository implements IOTPRepository {
  public async get(key: string): Promise<string | null> {
    return await redisClient.get(key);
  }

  public async set(key: string, expiry: number, value: string): Promise<void> {
    await redisClient.setEx(key, expiry, value);
  }

  public async del(key: string): Promise<void> {
    await redisClient.del(key);
  }
}

export default OTPRepository;
