export interface IOTPSchema {
  otp: string;
  isVerified: boolean;
}

export interface IOTPService {
  /**
   * Generates a new OTP and stores it with associated data for the given email. Used for secure user verification flows.
   */
  generateAndStoreOTP(
    email: string,
    data: Record<string, any>
  ): Promise<string>;

  /**
   * Validates the provided OTP for the given email. Used to confirm user identity during registration, login, or sensitive actions.
   */
  verifyOTP(email: string, OTP: string): Promise<void>;

  /**
   * Issues a new OTP to the given email. Used to support users who did not receive or lost their original OTP.
   */
  resendOTP(email: string): Promise<void>;

  /**
   * Retrieves data associated with a verified OTP for the given email. Used to complete verification-dependent workflows.
   */
  getVerifiedOTPData(email: string): Promise<Record<string, null> | null>;

  /**
   * Removes the OTP record for the given email. Used for cleanup after verification or expiration.
   */
  deleteOTP(email: string): Promise<void>;
}
