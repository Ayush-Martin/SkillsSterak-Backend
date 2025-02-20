import { IUser } from "../../models/User.model";

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
  isVerified: boolean;
}

export interface IAuthService {
  register(username: string, email: string, password: string): Promise<void>;
  completeRegister(OTP: string, email: string): Promise<void>;
  login(email: string, password: string): Promise<IUser | void>;
  googleAuth(
    googleID: string,
    email: string,
    username: string
  ): Promise<IUser | void>;
  verifyOTP(OTP: string, email: string): Promise<void>;
  forgetPassword(email: string): Promise<void>;
  resetPassword(email: string, password: string): Promise<void>;
  getUserById(userId: string): Promise<IUser | null>;
}
