export interface IOTPSchema {
  OTP: string;
  email: string;
  username: string;
  password: string;
}

export interface IOTPService {
  storeOTPAndUserData(
    email: string,
    expiry: number,
    userData: IOTPSchema
  ): Promise<void>;

  getOTPAndUserData(email: string): Promise<IOTPSchema | null>;

  deleteOTPAndUserData(email: string): Promise<void>;
}
