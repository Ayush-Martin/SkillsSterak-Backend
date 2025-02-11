import { hashSync, compareSync } from "bcryptjs";
import { config } from "dotenv";
config();

const PASSWORD_SALT_ROUNDS = Number(process.env.PASSWORD_SALT_ROUNDS) || 12;

export const hashPassword = (password: string): string => {
  return hashSync(password, PASSWORD_SALT_ROUNDS);
};

export const comparePassword = (
  password: string,
  hashedPassword: string
): boolean => {
  return compareSync(password, hashedPassword);
};
