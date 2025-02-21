import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import {
  IAuthService,
  IOTPRegisterSchema,
  IOTPResetPasswordSchema,
} from "../interfaces/services/IAuth.service";
import { IUser } from "../models/User.model";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../utils/statusCodes";
import { IOTPRepository } from "../interfaces/repositories/IOTP.repository";
import { generateOTP } from "../utils/OTP";
import { comparePassword, hashPassword } from "../utils/password";
import { sendMail } from "../utils/mailer";

class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private OTPRepository: IOTPRepository
  ) {}

  public async register(
    username: string,
    email: string,
    password: string
  ): Promise<void> {
    const userExist = await this.userRepository.getUserByEmail(email);

    if (userExist) {
      return errorCreator("User with email already exists ");
    }

    const OTP = generateOTP();
    const hashedPassword = hashPassword(password);

    await this.OTPRepository.set(
      email,
      300,
      JSON.stringify({ OTP, username, email, password: hashedPassword })
    );

    await sendMail(email, "OTP", OTP);
    console.log("OTP", OTP);
  }

  public async completeRegister(OTP: string, email: string): Promise<void> {
    const storedData = await this.OTPRepository.get(email);

    if (!storedData) {
      return errorCreator("OTP is expired", StatusCodes.GONE);
    }

    const registerData = JSON.parse(storedData) as IOTPRegisterSchema;

    if (OTP !== registerData.OTP) {
      return errorCreator("Invalid OTP", StatusCodes.UNAUTHORIZED);
    }

    await this.userRepository.createUser({
      username: registerData.username,
      email: registerData.email,
      password: registerData.password,
    });

    await this.OTPRepository.del(email);
  }

  public async login(email: string, password: string): Promise<IUser | void> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      return errorCreator("User not found", StatusCodes.NOT_FOUND);
    }

    const isPasswordValid = comparePassword(password, user.password!);

    if (!isPasswordValid) {
      errorCreator("Invalid credentials", StatusCodes.UNAUTHORIZED);
      return;
    }

    if (user.isBlocked) {
      return errorCreator(
        "You have been blocked by admin",
        StatusCodes.FORBIDDEN
      );
    }

    return user;
  }

  public async googleAuth(
    googleId: string,
    email: string,
    username: string
  ): Promise<IUser | void> {
    let user = await this.userRepository.getUserByGoogleId(googleId);

    if (!user) {
      user = await this.userRepository.createUser({
        googleId,
        email,
        username,
      });
    }

    return user;
  }

  public async forgetPassword(email: string): Promise<void> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      return errorCreator("User not exist", StatusCodes.NOT_FOUND);
    }

    const OTP = generateOTP();

    await this.OTPRepository.set(
      email,
      300,
      JSON.stringify({
        email,
        id: user.id,
        OTP,
        isVerified: false,
      })
    );

    await sendMail(email, "OTP", OTP);
    console.log("OTP", OTP);
  }

  public async verifyOTP(OTP: string, email: string): Promise<void> {
    const storedData = await this.OTPRepository.get(email);

    if (!storedData) {
      return errorCreator("OTP is expired", StatusCodes.GONE);
    }

    const registerData = JSON.parse(storedData) as IOTPResetPasswordSchema;

    if (OTP !== registerData.OTP) {
      return errorCreator("Invalid OTP", StatusCodes.UNAUTHORIZED);
    }

    await this.OTPRepository.set(
      email,
      300,
      JSON.stringify({
        email,
        id: registerData.id,
        OTP,
        isVerified: true,
      })
    );
  }

  public async resetPassword(email: string, password: string): Promise<void> {
    const storedData = await this.OTPRepository.get(email);

    if (!storedData) {
      return errorCreator("OTP is expired", StatusCodes.GONE);
    }

    const registerData = JSON.parse(storedData) as IOTPResetPasswordSchema;

    if (!registerData.isVerified) {
      return errorCreator("OTP is not verified", StatusCodes.UNAUTHORIZED);
    }

    const hashedPassword = hashPassword(password);

    await this.userRepository.updatePassword(registerData.id, hashedPassword);
  }

  public async getUserById(userId: string): Promise<IUser | null> {
    return await this.userRepository.getUserById(userId);
  }
}

export default AuthService;
