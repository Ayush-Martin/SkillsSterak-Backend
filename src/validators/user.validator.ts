import { z } from "zod";
import {
  AboutValidationRule,
  UsernameValidationRule,
} from "./rules/user.validationRule";

export const updateProfileValidator = (user: any) => {
  const schema = z.object({
    username: UsernameValidationRule,
    about: AboutValidationRule,
  });

  return schema.parse(user);
};
