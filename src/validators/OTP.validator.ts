import { z } from "zod";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../utils/statusCodes";

export const OTPValidator = ({
  OTP,
  email,
}: {
  OTP: string | null;
  email: string | null;
}) => {
  if (!OTP || !email) {
    return errorCreator("All fields are required", StatusCodes.BAD_REQUEST);
  }

  const schema = z.object({
    OTP: z.string().length(6, "OTP must contain 6 digits"),
    email: z.string().email("Invalid email"),
  });

  return schema.parse({ OTP, email });
};
