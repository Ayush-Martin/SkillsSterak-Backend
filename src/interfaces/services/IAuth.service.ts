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

  /**
   * Sends a one-time password (OTP) to the user for password recovery.
   * Supports secure account recovery and user verification flows.
   */
  forgetPassword(email: string): Promise<void>;

  /**
   * Resets the password for a user after verification.
   * Enables secure password changes and account restoration.
   */
  resetPassword(email: string, password: string): Promise<void>;

  /**
   * Retrieves a user by their unique ID.
   * Supports authentication, profile access, and validation flows.
   */
  getUserById(userId: string): Promise<IUser | null>;
}
