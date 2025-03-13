/** OTP repository interface */
export interface IOTPRepository {
  /** Retrieves a value from the store */
  get(key: string): Promise<string | null>;
  /** Sets a value in the store */
  set(key: string, expiry: number, value: string): Promise<void>;
  /** Deletes a value in the store */
  del(key: string): Promise<void>;
}
