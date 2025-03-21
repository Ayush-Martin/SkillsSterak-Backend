import { IUser } from "../../models/User.model";
import { IOTPSchema } from "./IOTP.service";

export interface IOTPRegisterSchema extends IOTPSchema {
  username: string;
  password: string;
}

export interface IOTPResetPasswordSchema extends IOTPSchema {
  id: string;
}

export interface IAuthService {
  /** Register a user with email, username and password */
  register(username: string, email: string, password: string): Promise<void>;

  /** Complete the registration process with OTP and email */
  completeRegister(email: string): Promise<void>;

  /** Login a user with email and password */
  login(email: string, password: string): Promise<IUser | void>;

  /** Login a user with google auth */
  googleAuth(
    googleID: string,
    email: string,
    username: string
  ): Promise<IUser | void>;

  /** Send OTP to user for forget password */
  forgetPassword(email: string): Promise<void>;

  /** Reset password for a user */
  resetPassword(email: string, password: string): Promise<void>;

  /** Get a user by ID */
  getUserById(userId: string): Promise<IUser | null>;
}
