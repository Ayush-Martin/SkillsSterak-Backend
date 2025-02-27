import { z } from "zod";
import {
  EmailValidationRule,
  OTPValidationRule,
} from "../utils/validationRules";

export const OTPValidator = (data: any) => {
  const schema = z.object({
    OTP: OTPValidationRule,
    email: EmailValidationRule,
  });

  return schema.parse(data);
};
