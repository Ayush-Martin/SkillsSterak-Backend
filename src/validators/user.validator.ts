import { z } from "zod";
import { UserValidationRule } from "../constants/validationRule";

export const registerUserValidator = (user: any) => {
  const schema = z.object({
    username: UserValidationRule.Username,
    email: UserValidationRule.Email,
    password: UserValidationRule.Password,
  });

  return schema.parse(user);
};

export const completeRegisterValidator = (data: any) => {
  const schema = z.object({
    email: UserValidationRule.Email,
  });

  return schema.parse(data);
};

export const loginUserValidator = (data: any) => {
  const schema = z.object({
    email: UserValidationRule.Email,
    password: UserValidationRule.Password,
  });

  return schema.parse(data);
};

export const forgetPasswordValidator = (data: any) => {
  const schema = z.object({
    email: UserValidationRule.Email,
  });

  return schema.parse(data);
};

export const resetPasswordValidator = (data: any) => {
  const schema = z.object({
    email: UserValidationRule.Email,
    password: UserValidationRule.Password,
  });

  return schema.parse(data);
};

export const changePasswordValidator = (data: any) => {
  const schema = z.object({
    currentPassword: UserValidationRule.Password,
    newPassword: UserValidationRule.Password,
  });

  return schema.parse(data);
};

export const updateProfileValidator = (user: any) => {
  const schema = z.object({
    id: z.string(),
    username: UserValidationRule.Username,
    position: UserValidationRule.Position,
    location: UserValidationRule.Location,
    company: UserValidationRule.Company,
    bio: UserValidationRule.Bio,
    education: UserValidationRule.Education,
    skills: UserValidationRule.Skills,
    experiences: UserValidationRule.Experience,
    socialLinks: UserValidationRule.SocialLinks,
  });

  return schema.parse(user);
};
