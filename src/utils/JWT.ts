import { sign, verify } from "jsonwebtoken";
import { IUser } from "../models/User.model";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRY_MIN = Number(process.env.ACCESS_TOKEN_EXPIRY_MIN)!;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY!;

export const generateAccessToken = (user: Partial<IUser>) => {
  return sign(user, ACCESS_TOKEN_SECRET, {
    expiresIn: `${ACCESS_TOKEN_EXPIRY_MIN}m`,
  });
};
