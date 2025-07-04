import { IOTPSchema } from "../services/IOTP.service";

/**
 * Repository interface for OTP (One-Time Password) data operations.
 * Supports secure authentication, verification, and OTP lifecycle management.
 */
export interface IOTPRepository {
  /**
   * Stores OTP and any associated data for a user.
   * Enables multi-step verification and secure data binding.
   */
  storeOTPData(
    email: string,
    otp: string,
    data: Record<string, any>
  ): Promise<void>;

  /**
   * Updates the OTP value for a user.
   * Supports OTP regeneration and re-sending scenarios.
   */
  updateOTP(email: string, otp: string): Promise<void>;

  /**
   * Retrieves the OTP record for a user.
   * Used for validation and expiration checks during authentication.
   */
  getOTP(email: string): Promise<IOTPSchema | null>;

  /**
   * Retrieves any data associated with a user's OTP.
   * Supports context-aware verification and custom flows.
   */
  getOTPData(email: string): Promise<Record<string, any> | null>;

  /**
   * Marks a user's OTP as verified.
   * Enables single-use enforcement and audit trails.
   */
  markVerified(email: string): Promise<void>;

  /**
   * Deletes the OTP record for a user.
   * Supports cleanup after verification or expiration.
   */
  deleteOTP(email: string): Promise<void>;
}
