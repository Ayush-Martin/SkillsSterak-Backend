import { ObjectId } from "mongoose";
import { IOTPRepository } from "../interfaces/IOTP.repository";
import {
  IOTPRegisterSchema,
  IOTPResetPasswordSchema,
  IOTPService,
} from "../interfaces/IOTP.service";

class OTPService implements IOTPService {
  constructor(public OTPRepository: IOTPRepository) {}

  public async getOTPAndRegisterData(
    email: string
  ): Promise<IOTPRegisterSchema | null> {
    const data = await this.OTPRepository.get(email);
    if (!data) return null;
    return JSON.parse(data) as IOTPRegisterSchema;
  }

  public async storeOTPAndRegisterData(
    email: string,
    expiry: number,
    userData: IOTPRegisterSchema
  ): Promise<void> {
    await this.OTPRepository.set(email, expiry, JSON.stringify(userData));
  }

  public async deleteOTPAndRegisterData(email: string): Promise<void> {
    await this.OTPRepository.del(email);
  }

  public async getOTPAndResetPasswordData(
    email: string
  ): Promise<IOTPResetPasswordSchema | null> {
    const data = await this.OTPRepository.get(email);
    if (!data) return null;
    return JSON.parse(data) as IOTPResetPasswordSchema;
  }

  public async storeOTPAndResetPasswordData(
    email: string,
    expiry: number,
    data: IOTPResetPasswordSchema
  ): Promise<void> {
    await this.OTPRepository.set(email, expiry, JSON.stringify(data));
  }

  public async deleteOTPAndResetPasswordData(email: string): Promise<void> {}
}

export default OTPService;
