
import { AuthMessage } from "../constants/responseMessages";
import { StatusCodes } from "../constants/statusCodes";
import { IOTPRepository } from "../interfaces/repositories/IOTP.repository";
import { IOTPService } from "../interfaces/services/IOTP.service";
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

    await this.OTPRepository.storeOTPData(email, OTP, data);

    return OTP;
  }

  public async verifyOTP(email: string, OTP: string): Promise<void> {
    const data = await this.OTPRepository.getOTP(email);

    if (!data) {
      return errorCreator(AuthMessage.InvalidOtp, StatusCodes.GONE);
    }

    if (OTP !== data.otp) {
      return errorCreator(AuthMessage.InvalidOtp, StatusCodes.UNAUTHORIZED);
    }

    await this.OTPRepository.markVerified(email);
  }

  public async getVerifiedOTPData(
    email: string
  ): Promise<Record<string, any> | null> {
    const OTPData = await this.OTPRepository.getOTP(email);
    const storedData = await this.OTPRepository.getOTPData(email);

    if (!OTPData || !storedData) {
      return null;
    }

    if (!OTPData.isVerified) {
      return null;
    }

    return storedData;
  }

  public async resendOTP(email: string): Promise<void> {
    const OTP = generateOTP();

    await this.OTPRepository.updateOTP(email, OTP);

    sendMail(email, "OTP", OTP);
  }

  public async deleteOTP(email: string): Promise<void> {
    await this.OTPRepository.deleteOTP(email);
  }
}

export default OTPService;
