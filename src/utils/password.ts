import { hashSync, compareSync } from "bcryptjs";
import envConfig from "../config/env";


/**
 * Hash a password using bcrypt
 * @param password the password to hash
 * @returns a string representing the hashed password
 */
export const hashPassword = (password: string): string => {
  return hashSync(password, envConfig.PASSWORD_SALT_ROUNDS);
};

/**
 * Compare a plain text password with a hashed password.
 * @param password - The plain text password to compare.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A boolean indicating whether the passwords match.
 */
export const comparePassword = (
  password: string,
  hashedPassword: string
): boolean => {
  // Use bcrypt's compareSync function to check if the password matches the hashed password
  return compareSync(password, hashedPassword);
};
