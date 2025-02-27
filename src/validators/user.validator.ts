import { z } from "zod";
import {
  AboutValidationRule,
  PageValidationRule,
  SearchValidationRule,
  UsernameValidationRule,
} from "../utils/validationRules";

export const updateProfileValidator = (user: any) => {
  const schema = z.object({
    username: UsernameValidationRule,
    about: AboutValidationRule,
  });

  return schema.parse(user);
};

export const getUsersValidator = (data: any) => {
  const schema = z.object({
    search: SearchValidationRule,
    page: PageValidationRule,
  });

  return schema.parse(data);
};
