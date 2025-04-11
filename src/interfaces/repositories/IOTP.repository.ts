import { IOTPSchema } from "../services/IOTP.service";

export interface IOTPRepository {
  storeOTPData(
    email: string,
    otp: string,
    data: Record<string, any>
  ): Promise<void>;
  updateOTP(email: string, otp: string): Promise<void>;
  getOTP(email: string): Promise<IOTPSchema | null>;
  getOTPData(email: string): Promise<Record<string, any> | null>;
  markVerified(email: string): Promise<void>;
  deleteOTP(email: string): Promise<void>;
}
