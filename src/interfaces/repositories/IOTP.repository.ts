import { IOTPSchema } from "../services/IOTP.service";

export interface IOTPRepository {
  /** Store OTP and associated data for a user */
  storeOTPData(
    email: string,
    otp: string,
    data: Record<string, any>
  ): Promise<void>;
  /** Update the OTP for a user */
  updateOTP(email: string, otp: string): Promise<void>;
  /** Get the OTP for a user */
  getOTP(email: string): Promise<IOTPSchema | null>;
  /** Get associated OTP data for a user */
  getOTPData(email: string): Promise<Record<string, any> | null>;
  /** Mark a user's OTP as verified */
  markVerified(email: string): Promise<void>;
  /** Delete the OTP for a user */
  deleteOTP(email: string): Promise<void>;
}
