import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import {
  IAuthService,
  IOTPRegisterSchema,
  IOTPResetPasswordSchema,
} from "../interfaces/services/IAuth.service";
import { IUser } from "../models/User.model";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../constants/statusCodes";
import { comparePassword, hashPassword } from "../utils/password";
import { sendMail } from "../utils/mailer";
import { IOTPService } from "../interfaces/services/IOTP.service";
import { AuthMessage, UserMessage } from "../constants/responseMessages";

class AuthService implements IAuthService {
  constructor(
    private _userRepository: IUserRepository,
    private _OTPService: IOTPService
  ) {}

  public async register(
    username: string,
    email: string,
    password: string
  ): Promise<void> {
    const userExist = await this._userRepository.getUserByEmail(email);

    if (userExist) {
      return errorCreator(AuthMessage.EmailExists, StatusCodes.CONFLICT);
    }

    const hashedPassword = hashPassword(password);

    const OTP = await this._OTPService.generateAndStoreOTP(email, {
      email,
      username,
      password: hashedPassword,
    });

    await sendMail(email, "OTP", OTP);
  }

  public async completeRegister(email: string): Promise<void> {
    const storedData = await this._OTPService.getVerifiedOTPData(email);

    if (!storedData) {
      return errorCreator(AuthMessage.OtpNotVerified, StatusCodes.UNAUTHORIZED);
    }

    const registerData = storedData as any as IOTPRegisterSchema;

    await this._userRepository.create({
      username: registerData.username,
      email: email,
      password: registerData.password,
      socialLinks: {},
    });

    await this._OTPService.deleteOTP(email);
  }

  public async login(email: string, password: string): Promise<IUser | void> {
    const user = await this._userRepository.getUserByEmail(email);

    if (!user) {
      return errorCreator(UserMessage.UserNotFound, StatusCodes.NOT_FOUND);
    }

    if (!user.password) {
      return errorCreator(
        AuthMessage.InvalidCredentials,
        StatusCodes.UNAUTHORIZED
      );
    }

    const isPasswordValid = comparePassword(password, user.password!);

    if (!isPasswordValid) {
      errorCreator(AuthMessage.InvalidCredentials, StatusCodes.UNAUTHORIZED);
      return;
    }

    if (user.isBlocked) {
      return errorCreator(AuthMessage.UserBlocked, StatusCodes.FORBIDDEN);
    }

    return user;
  }

  public async googleAuth(
    googleId: string,
    email: string,
    username: string
  ): Promise<IUser | void> {
    let user = await this._userRepository.getUserByGoogleId(googleId);

    if (!user) {
      user = await this._userRepository.create({
        googleId,
        email,
        username,
      });
    }

    if (user.isBlocked) {
      errorCreator(AuthMessage.UserBlocked, StatusCodes.FORBIDDEN);
    }

    return user;
  }

  public async forgetPassword(email: string): Promise<void> {
    const user = await this._userRepository.getUserByEmail(email);

    if (!user) {
      return errorCreator(UserMessage.UserNotFound, StatusCodes.NOT_FOUND);
    }

    const OTP = await this._OTPService.generateAndStoreOTP(email, {
      email,
      id: user.id,
    });

    await sendMail(email, "OTP", OTP);
  }

  public async resetPassword(email: string, password: string): Promise<void> {
    const data = await this._OTPService.getVerifiedOTPData(email);
    if (!data) {
      return errorCreator(AuthMessage.OtpNotVerified, StatusCodes.UNAUTHORIZED);
    }

    const { id } = data as any as IOTPResetPasswordSchema;

    const hashedPassword = hashPassword(password);

    await this._userRepository.updatePassword(id, hashedPassword);
  }

  public async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this._userRepository.findById(userId);

    console.log(user);

    if (!comparePassword(currentPassword, user?.password!)) {
      errorCreator(AuthMessage.InvalidCurrentPassword, StatusCodes.BAD_REQUEST);
    }

    const hashedPassword = hashPassword(newPassword);

    await this._userRepository.updatePassword(userId, hashedPassword);
  }

  public async getUserById(userId: string): Promise<IUser | null> {
    return await this._userRepository.findById(userId);
  }
}

export default AuthService;
