import { IOTPRepository } from "../interfaces/IOTP.repository";
import { IOTPSchema, IOTPService } from "../interfaces/IOTP.service";

class OTPService implements IOTPService {
  constructor(public OTPRepository: IOTPRepository) {}

  public async getOTPAndUserData(email: string): Promise<IOTPSchema | null> {
    const data = await this.OTPRepository.get(email);
    if (!data) return null;
    return JSON.parse(data) as IOTPSchema;
  }

  public async storeOTPAndUserData(
    email: string,
    expiry: number,
    userData: IOTPSchema
  ): Promise<void> {
    await this.OTPRepository.set(email, expiry, JSON.stringify(userData));
  }

  public async deleteOTPAndUserData(email: string): Promise<void> {
    await this.OTPRepository.del(email);
  }
}

export default OTPService;
