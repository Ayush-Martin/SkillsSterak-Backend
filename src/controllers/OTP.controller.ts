import { Request, Response, NextFunction } from "express";
import { IOTPService } from "../interfaces/services/IOTP.service";
import binder from "../utils/binder";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { VERIFY_OTP_SUCCESS_MESSAGE } from "../constants/responseMessages";

/** OTP controller: manages OTP verification and resend */
class OTPController {
  /** Injects OTP service */
  constructor(private OTPService: IOTPService) {
    binder(this);
  }

  /** Verify OTP for user */
  public async verifyOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, OTP } = req.body;
      await this.OTPService.verifyOTP(email, OTP);
      res
        .status(StatusCodes.OK)
        .json(successResponse(VERIFY_OTP_SUCCESS_MESSAGE));
    } catch (error) {
      next(error);
    }
  }

  /** Resend OTP to user */
  public async resendOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;
      await this.OTPService.resendOTP(email);
      res.status(StatusCodes.OK).json(successResponse("otp is resent"));
    } catch (error) {
      next(error);
    }
  }
}

export default OTPController;
