import { z } from "zod";
import {
  BioValidationRule,
  CompanyValidationRule,
  GithubValidationRule,
  PlaceValidationRule,
  PositionValidationRule,
  UsernameValidationRule,
  LinkedinValidationRule,
  WebsiteValidationRule,
} from "./rules/user.validationRule";

export const updateProfileValidator = (user: any) => {
  const schema = z.object({
    username: UsernameValidationRule,
    position: PositionValidationRule,
    place: PlaceValidationRule,
    company: CompanyValidationRule,
    bio: BioValidationRule,
    github: GithubValidationRule,
    linkedin: LinkedinValidationRule,
    website: WebsiteValidationRule,
    educationalQualification: z.string(),
    skills: z.string(),
    yearsOfExperience: z.number(),
  });

  return schema.parse(user);
};
