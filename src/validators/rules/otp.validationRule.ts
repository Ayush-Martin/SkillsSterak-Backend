import { z } from "zod";

export const OTPValidationRule = z
  .string()
  .length(6, "OTP must contain 6 digits");
