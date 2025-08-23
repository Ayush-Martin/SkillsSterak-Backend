import z from "zod";
import { LiveSessionValidationRule } from "../constants/validationRule";

export const ScheduleLiveSessionValidator = (data: any) => {
  const schema = z.object({
    title: LiveSessionValidationRule.title,
    description: LiveSessionValidationRule.description,
    date: LiveSessionValidationRule.date,
    time: LiveSessionValidationRule.time,
  });

  return schema.parse(data);
};
