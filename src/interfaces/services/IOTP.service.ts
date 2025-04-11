export interface IOTPSchema {
  otp: string;
  isVerified: boolean;
}

export interface IOTPService {
  generateAndStoreOTP(
    email: string,
    data: Record<string, any>
  ): Promise<string>;
  verifyOTP(email: string, OTP: string): Promise<void>;
  resendOTP(email: string): Promise<void>;
  getVerifiedOTPData(email: string): Promise<Record<string, null> | null>;
  deleteOTP(email: string): Promise<void>;
}
