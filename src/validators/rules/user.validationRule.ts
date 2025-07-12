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

export const BioValidationRule = z
  .string()
  .max(2000, { message: "Bio must be 2000 characters or less" });

export const PlaceValidationRule = z.string();

export const PositionValidationRule = z.string();

export const CompanyValidationRule = z.string();

export const GithubValidationRule = z
  .string()
  .url({ message: "Enter a valid GitHub URL" })
  .optional();

export const LinkedinValidationRule = z
  .string()
  .url({ message: "Enter a valid LinkedIn URL" })
  .optional();

export const WebsiteValidationRule = z
  .string()
  .url({ message: "Enter a valid Website URL" })
  .optional();
