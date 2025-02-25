import { sign, verify } from "jsonwebtoken";
import { IUser } from "../models/User.model";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRY_MIN = Number(process.env.ACCESS_TOKEN_EXPIRY_MIN)!;
const REFRESH_TOKEN_EXPIRY_DAY = Number(process.env.REFRESH_TOKEN_EXPIRY_DAY)!;

export const generateAccessToken = (user: Partial<IUser>) => {
  return sign(
    { sub: user._id, ...user, password: undefined }, //removing password from token
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: `${ACCESS_TOKEN_EXPIRY_MIN}m`,
    }
  );
};

export const generateRefreshToken = (user: Partial<IUser>) => {
  return sign({ sub: user._id, email: user.email }, REFRESH_TOKEN_SECRET, {
    expiresIn: `${REFRESH_TOKEN_EXPIRY_DAY}d`,
  });
};
