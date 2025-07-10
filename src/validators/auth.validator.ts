import { z } from "zod";
import {
  EmailValidationRule,
  PasswordValidationRule,
  UsernameValidationRule,
} from "./rules/user.validationRule";

export const registerUserValidator = (user: any) => {
  const schema = z.object({
    username: UsernameValidationRule,
    email: EmailValidationRule,
    password: PasswordValidationRule,
  });

  return schema.parse(user);
};

export const completeRegisterValidator = (data: any) => {
  const schema = z.object({
    email: EmailValidationRule,
  });

  return schema.parse(data);
};

export const loginUserValidator = (data: any) => {
  const schema = z.object({
    email: EmailValidationRule,
    password: PasswordValidationRule,
  });

  return schema.parse(data);
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

export const changePasswordValidator = (data: any) => {
  const schema = z.object({
    currentPassword: PasswordValidationRule,
    newPassword: PasswordValidationRule,
  });

  return schema.parse(data);
};
