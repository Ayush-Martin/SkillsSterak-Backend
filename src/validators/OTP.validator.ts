import { z } from "zod";
import {
  OTPValidationRule,
  UserValidationRule,
} from "../constants/validationRule";

export const OTPValidator = (data: any) => {
  const schema = z.object({
    OTP: OTPValidationRule.OTP,
    email: UserValidationRule.Email,
  });

  return schema.parse(data);
};
