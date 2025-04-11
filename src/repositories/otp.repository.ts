import { IOTPRepository } from "../interfaces/repositories/IOTP.repository";
import { IOTPSchema } from "../interfaces/services/IOTP.service";
import { redisClient } from "../config/DB/redis";

class OTPRepository implements IOTPRepository {
  public async storeOTPData(
    email: string,
    otp: string,
    data: Record<string, any>
  ): Promise<void> {
    console.log(`[OTP] Email: ${email} | OTP: ${otp}`);

    await redisClient.setEx(`otp:${email}`, 300, JSON.stringify({ otp }));
    await redisClient.set(`user:${email}`, JSON.stringify(data));
  }

  public async updateOTP(email: string, otp: string): Promise<void> {
    console.log(`[OTP] Email: ${email} | OTP: ${otp}`);

    await redisClient.setEx(`otp:${email}`, 300, JSON.stringify({ otp }));
  }

  public async getOTP(email: string): Promise<IOTPSchema | null> {
    const otpDataString = await redisClient.get(`otp:${email}`);
    if (!otpDataString) {
      return null;
    }
    return JSON.parse(otpDataString) as IOTPSchema;
  }

  public async getOTPData(email: string): Promise<Record<string, any> | null> {
    const storedDataString = await redisClient.get(`user:${email}`);
    if (!storedDataString) {
      return null;
    }
    return JSON.parse(storedDataString) as Record<string, any>;
  }

  public async markVerified(email: string): Promise<void> {
    await redisClient.setEx(
      `otp:${email}`,
      300,
      JSON.stringify({ isVerified: true })
    );
  }

  public async deleteOTP(email: string): Promise<void> {
    await redisClient.del(`otp:${email}`);
    await redisClient.del(`user:${email}`);
  }
}

export default OTPRepository;
