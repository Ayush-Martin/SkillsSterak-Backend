import { z } from "zod";
import { EmailValidationRule } from "./rules/user.validationRule";
import { OTPValidationRule } from "./rules/otp.validationRule";

export const OTPValidator = (data: any) => {
  const schema = z.object({
    OTP: OTPValidationRule,
    email: EmailValidationRule,
  });

  return schema.parse(data);
};
