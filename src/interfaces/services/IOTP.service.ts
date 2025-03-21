export interface IOTPSchema {
  OTP: string;
  isVerified: boolean;
}

export interface IOTPService {
  generateAndStoreOTP(
    email: string,
    data: Record<string, any>
  ): Promise<string>;
  verifyOTP(email: string, OTP: string): Promise<void>;
  resendOTP(email: string): Promise<void>;
  getVerifiedOTPData(email: string): Promise<IOTPSchema | null>;
}
