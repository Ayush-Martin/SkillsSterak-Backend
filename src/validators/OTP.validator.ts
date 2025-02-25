import { z } from "zod";

export const OTPValidator = (data: {
  OTP: string | null;
  email: string | null;
}) => {
  const schema = z.object({
    OTP: z.string().length(6, "OTP must contain 6 digits"),
    email: z.string().email("Invalid email"),
  });

  return schema.parse(data);
};
