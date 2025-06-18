export interface IOTPSchema {
  otp: string;
  isVerified: boolean;
}

export interface IOTPService {
  /** Generates and stores an OTP for the given email and data. */
  generateAndStoreOTP(
    email: string,
    data: Record<string, any>
  ): Promise<string>;
  /** Verifies the OTP for the given email. */
  verifyOTP(email: string, OTP: string): Promise<void>;
  /** Resends an OTP to the given email. */
  resendOTP(email: string): Promise<void>;
  /** Retrieves verified OTP data for the given email. */
  getVerifiedOTPData(email: string): Promise<Record<string, null> | null>;
  /** Deletes the OTP for the given email. */
  deleteOTP(email: string): Promise<void>;
}
