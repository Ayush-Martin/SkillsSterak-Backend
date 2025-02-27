import { z } from "zod";

export const EmailValidationRule = z.string().email("Invalid email");

export const PasswordValidationRule = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(100, { message: "Password must be 100 characters or less" })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/\d/, { message: "Password must contain at least one number" })
  .regex(/[\W_]/, {
    message: "Password must contain at least one special character",
  });

export const UsernameValidationRule = z
  .string()
  .min(3, { message: "Username must be at least 3 characters long" })
  .max(20, { message: "Username must be 20 characters or less" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores",
  });

export const OTPValidationRule = z
  .string()
  .length(6, "OTP must contain 6 digits");

export const AboutValidationRule = z
  .string()
  .max(20, { message: "About must be 20 characters or less" });

export const AreaOfInterestValidationRule = z.array(z.string());

export const CategoryNameValidationRule = z
  .string()
  .min(3, "category name must have at least 3 characters")
  .max(20, "category name must be within 20 characters");

export const SearchValidationRule = z.string().default("");

export const PageValidationRule = z.preprocess(
  (val) => Number(val),
  z.number().default(1)
);

export const TrainerRequestStatusValidationRule = z.enum(
  ["approved", "rejected"],
  { message: "trainer request status is missing or not in correct format" }
);
