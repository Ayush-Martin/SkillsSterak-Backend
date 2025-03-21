import { Request, Response, NextFunction } from "express";
import { IOTPService } from "../interfaces/services/IOTP.service";
import binder from "../utils/binder";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { VERIFY_OTP_SUCCESS_MESSAGE } from "../constants/responseMessages";

class OTPController {
  constructor(private OTPService: IOTPService) {
    binder(this);
  }

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

  public async resendOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.query as { email: string };
      await this.OTPService.resendOTP(email);
      res.status(StatusCodes.OK).json(successResponse("otp is resent"));
    } catch (error) {
      next(error);
    }
  }
}

export default OTPController;
