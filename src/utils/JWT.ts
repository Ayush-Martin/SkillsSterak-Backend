import { sign, verify } from "jsonwebtoken";
import { IUser } from "../models/User.model";
import { ObjectId } from "mongoose";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRY_MIN = Number(process.env.ACCESS_TOKEN_EXPIRY_MIN)!;
const REFRESH_TOKEN_EXPIRY_DAY = Number(process.env.REFRESH_TOKEN_EXPIRY_DAY)!;

export const generateAccessToken = (user: Partial<IUser>) => {
  return sign({ ...user, password: undefined }, ACCESS_TOKEN_SECRET, {
    expiresIn: `${ACCESS_TOKEN_EXPIRY_MIN}m`,
  });
};

export const generateRefreshToken = (id: ObjectId, email: string) => {
  return sign({ id, email }, REFRESH_TOKEN_SECRET, {
    expiresIn: `${REFRESH_TOKEN_EXPIRY_DAY}d`,
  });
};
