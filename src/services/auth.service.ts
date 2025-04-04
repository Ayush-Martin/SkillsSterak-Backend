import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import {
  IAuthService,
  IOTPRegisterSchema,
  IOTPResetPasswordSchema,
} from "../interfaces/services/IAuth.service";
import { IUser } from "../models/User.model";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../constants/statusCodes";
import { IOTPRepository } from "../interfaces/repositories/IRedis.repository";
import { generateOTP } from "../utils/OTP";
import { comparePassword, hashPassword } from "../utils/password";
import { sendMail } from "../utils/mailer";
import {
  BLOCKED_ERROR_MESSAGE,
  EMAIL_EXIST_ERROR_MESSAGE,
  INVALID_CREDENTIALS_ERROR_MESSAGE,
  INVALID_OTP_ERROR_MESSAGE,
  OTP_EXPIRED_ERROR_MESSAGE,
  OTP_NOT_VERIFIED_ERROR_MESSAGE,
  USER_BLOCKED_ERROR_MESSAGE,
  USER_NOT_FOUND_ERROR_MESSAGE,
} from "../constants/responseMessages";
import { IOTPService } from "../interfaces/services/IOTP.service";

class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private OTPRepository: IOTPRepository,
    private OTPService: IOTPService
  ) {}

  public async register(
    username: string,
    email: string,
    password: string
  ): Promise<void> {
    const userExist = await this.userRepository.getUserByEmail(email);

    if (userExist) {
      return errorCreator(EMAIL_EXIST_ERROR_MESSAGE, StatusCodes.CONFLICT);
    }

    const hashedPassword = hashPassword(password);

    const OTP = await this.OTPService.generateAndStoreOTP(email, {
      email,
      username,
      password: hashedPassword,
    });

    await sendMail(email, "OTP", OTP);
    console.log("OTP", OTP);
  }

  public async completeRegister(email: string): Promise<void> {
    const storedData = await this.OTPService.getVerifiedOTPData(email);

    if (!storedData) {
      return errorCreator(
        OTP_NOT_VERIFIED_ERROR_MESSAGE,
        StatusCodes.UNAUTHORIZED
      );
    }

    const registerData = storedData as any as IOTPRegisterSchema;

    await this.userRepository.create({
      username: registerData.username,
      email: email,
      password: registerData.password,
    });

    await this.OTPRepository.del(email);
  }

  public async login(email: string, password: string): Promise<IUser | void> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      return errorCreator(USER_NOT_FOUND_ERROR_MESSAGE, StatusCodes.NOT_FOUND);
    }

    if (!user.password) {
      return errorCreator(
        INVALID_CREDENTIALS_ERROR_MESSAGE,
        StatusCodes.UNAUTHORIZED
      );
    }

    const isPasswordValid = comparePassword(password, user.password!);

    if (!isPasswordValid) {
      errorCreator(INVALID_CREDENTIALS_ERROR_MESSAGE, StatusCodes.UNAUTHORIZED);
      return;
    }

    if (user.isBlocked) {
      return errorCreator(BLOCKED_ERROR_MESSAGE, StatusCodes.FORBIDDEN);
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
      user = await this.userRepository.create({
        googleId,
        email,
        username,
      });
    }

    if (user.isBlocked) {
      errorCreator(USER_BLOCKED_ERROR_MESSAGE, StatusCodes.FORBIDDEN);
    }

    return user;
  }

  public async forgetPassword(email: string): Promise<void> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      return errorCreator(USER_NOT_FOUND_ERROR_MESSAGE, StatusCodes.NOT_FOUND);
    }

    console.log("hello");

    const OTP = await this.OTPService.generateAndStoreOTP(email, {
      email,
      id: user.id,
    });

    console.log(OTP);

    await sendMail(email, "OTP", OTP);
    console.log("OTP", OTP);
  }

  public async resetPassword(email: string, password: string): Promise<void> {
    const data = await this.OTPService.getVerifiedOTPData(email);
    if (!data) {
      return errorCreator(
        OTP_NOT_VERIFIED_ERROR_MESSAGE,
        StatusCodes.UNAUTHORIZED
      );
    }

    const { id } = data as any as IOTPResetPasswordSchema;

    const hashedPassword = hashPassword(password);

    await this.userRepository.updatePassword(id, hashedPassword);
  }

  public async getUserById(userId: string): Promise<IUser | null> {
    return await this.userRepository.findById(userId);
  }
}

export default AuthService;
