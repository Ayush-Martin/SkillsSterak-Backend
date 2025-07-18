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
    location: PlaceValidationRule,
    company: CompanyValidationRule,
    bio: BioValidationRule,
    education: z.string(),
    skills: z.array(z.string()),
    experiences: z.array(
      z.object({
        id: z.string(),
        company: z.string(),
        position: z.string(),
        duration: z.string(),
        description: z.string(),
      })
    ),
    socialLinks: z.object({
      github: z.string(),
      linkedin: z.string(),
      website: z.string(),
      instagram: z.string(),
      facebook: z.string(),
      youtube: z.string(),
    }),
  });

  return schema.parse(user);
};
