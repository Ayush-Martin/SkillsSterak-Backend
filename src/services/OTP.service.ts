import {
  INVALID_OTP_ERROR_MESSAGE,
  OTP_EXPIRED_ERROR_MESSAGE,
} from "../constants/responseMessages";
import { StatusCodes } from "../constants/statusCodes";
import { IOTPRepository } from "../interfaces/repositories/IOTP.repository";
import { IOTPSchema, IOTPService } from "../interfaces/services/IOTP.service";
import errorCreator from "../utils/customError";
import { sendMail } from "../utils/mailer";
import { generateOTP } from "../utils/OTP";

class OTPService implements IOTPService {
  constructor(private OTPRepository: IOTPRepository) {}

  public async generateAndStoreOTP(
    email: string,
    data: Record<string, any>
  ): Promise<string> {
    const OTP = generateOTP();

    await this.OTPRepository.setWithExpiry(
      `otp:${email}`,
      300,
      JSON.stringify({ OTP, isVerified: false })
    );
    await this.OTPRepository.set(`user:${email}`, JSON.stringify(data));

    return OTP;
  }

  public async verifyOTP(email: string, OTP: string): Promise<void> {
    const OTPDataString = await this.OTPRepository.get(`otp:${email}`);

    if (!OTPDataString) {
      return errorCreator(OTP_EXPIRED_ERROR_MESSAGE, StatusCodes.GONE);
    }

    const OTPData = JSON.parse(OTPDataString) as IOTPSchema;

    if (OTP !== OTPData.OTP) {
      return errorCreator(INVALID_OTP_ERROR_MESSAGE, StatusCodes.UNAUTHORIZED);
    }

    await this.OTPRepository.setWithExpiry(
      `otp:${email}`,
      300,
      JSON.stringify({ ...OTPData, isVerified: true })
    );
  }

  public async getVerifiedOTPData(
    email: string
  ): Promise<Record<string, any> | null> {
    console.log("get verifeid data");
    const otpDataString = await this.OTPRepository.get(`otp:${email}`);
    const storedDataString = await this.OTPRepository.get(`user:${email}`);
    console.log(otpDataString, storedDataString);
    if (!otpDataString || !storedDataString) {
      return null;
    }

    const OTPData = JSON.parse(otpDataString) as IOTPSchema;

    if (!OTPData.isVerified) {
      return null;
    }

    await this.OTPRepository.del(email);

    return JSON.parse(storedDataString);
  }

  public async resendOTP(email: string): Promise<void> {
    const OTP = generateOTP();
    await this.OTPRepository.setWithExpiry(
      `otp:${email}`,
      300,
      JSON.stringify({ OTP, isVerified: false })
    );
    console.log(OTP, email);
    sendMail(email, "OTP", OTP);
  }
}

export default OTPService;
