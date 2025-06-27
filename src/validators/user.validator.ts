import { z } from "zod";
import {
  AboutValidationRule,
  BioValidationRule,
  CompanyValidationRule,
  PlaceValidationRule,
  PositionValidationRule,
  SocialLinksValidationRule,
  UsernameValidationRule,
} from "./rules/user.validationRule";

export const updateProfileValidator = (user: any) => {
  const schema = z.object({
    username: UsernameValidationRule,
    position: PositionValidationRule,
    place: PlaceValidationRule,
    company: CompanyValidationRule,
    bio: BioValidationRule,
    socialLinks: SocialLinksValidationRule,
  });

  return schema.parse(user);
};
