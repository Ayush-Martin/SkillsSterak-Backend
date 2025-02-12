import { ObjectId } from "mongoose";

export interface IOTPRegisterSchema {
  OTP: string;
  email: string;
  username: string;
  password: string;
}

export interface IOTPResetPasswordSchema {
  OTP: string;
  email: string;
  id: string;
}

export interface IOTPService {
  storeOTPAndRegisterData(
    email: string,
    expiry: number,
    userData: IOTPRegisterSchema
  ): Promise<void>;

  getOTPAndRegisterData(email: string): Promise<IOTPRegisterSchema | null>;

  deleteOTPAndRegisterData(email: string): Promise<void>;

  storeOTPAndResetPasswordData(
    email: string,
    expiry: number,
    data: IOTPResetPasswordSchema
  ): Promise<void>;

  getOTPAndResetPasswordData(
    email: string
  ): Promise<IOTPResetPasswordSchema | null>;

  deleteOTPAndResetPasswordData(email: string): Promise<void>;
}
