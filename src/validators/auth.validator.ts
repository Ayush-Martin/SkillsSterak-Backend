import { z } from "zod";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../utils/statusCodes";
import { IUser } from "../models/User.model";

export const registerUserValidator = (user: Partial<IUser>) => {
  const schema = z.object({
    username: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." }),
  });

  return schema.parse(user);
};

export const loginUserValidator = (user: Partial<IUser>) => {
  const { email, password } = user;

  if (!email || !password) {
    return errorCreator(
      "Please provide all the required fields",
      StatusCodes.BAD_REQUEST
    );
  }

  return { email, password };
};

export const forgetPasswordValidator = (data: { email: string | null }) => {
  const schema = z.object({
    email: z.string().email("Invalid email"),
  });

  return schema.parse(data);
};

export const resetPasswordValidator = (data: {
  password: string | null;
  email: string | null;
}) => {
  const schema = z.object({
    email: z.string().email("invalid email"),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." }),
  });

  return schema.parse(data);
};
