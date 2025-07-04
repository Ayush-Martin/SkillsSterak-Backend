import { Request, Response, NextFunction } from "express";
import { IOTPService } from "../interfaces/services/IOTP.service";
import binder from "../utils/binder";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { AuthMessage } from "../constants/responseMessages";

/**
 * Handles OTP verification and resend logic for user authentication flows.
 * All methods are bound for safe Express routing.
 */
class OTPController {
  constructor(private OTPService: IOTPService) {
    // Ensures 'this' context is preserved for all methods
    binder(this);
  }

  /**
   * Verifies the OTP for a user, enabling secure registration or password reset.
   */
  public async verifyOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, OTP } = req.body;
      await this.OTPService.verifyOTP(email, OTP);
      res.status(StatusCodes.OK).json(successResponse(AuthMessage.OtpVerified));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Resends an OTP to the user, supporting retry flows for failed or expired OTPs.
   */
  public async resendOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;
      await this.OTPService.resendOTP(email);
      res.status(StatusCodes.OK).json(successResponse(AuthMessage.OTPResent));
    } catch (error) {
      next(error);
    }
  }
}

export default OTPController;
