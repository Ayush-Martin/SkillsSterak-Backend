import { z } from "zod";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../utils/statusCodes";
import { IUser } from "../models/User.model";
import {
  EmailValidationRule,
  PasswordValidationRule,
  UsernameValidationRule,
} from "../utils/validationRules";

export const registerUserValidator = (user: any) => {
  const schema = z.object({
    username: UsernameValidationRule,
    email: EmailValidationRule,
    password: PasswordValidationRule,
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

export const forgetPasswordValidator = (data: any) => {
  const schema = z.object({
    email: EmailValidationRule,
  });

  return schema.parse(data);
};

export const resetPasswordValidator = (data: any) => {
  const schema = z.object({
    email: EmailValidationRule,
    password: PasswordValidationRule,
  });

  return schema.parse(data);
};
