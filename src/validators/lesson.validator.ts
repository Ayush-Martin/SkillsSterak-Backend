import { z } from "zod";

import { LessonValidationRule } from "../constants/validationRule";

export const addLessonValidator = (data: any) => {
  const schema = z.object({
    title: LessonValidationRule.title,
    description: LessonValidationRule.description,
    type: LessonValidationRule.type,
    duration: LessonValidationRule.duration,
  });

  return schema.parse(data);
};

export const updateLessonDetailsValidator = (data: any) => {
  const schema = z.object({
    title: LessonValidationRule.title,
    description: LessonValidationRule.description,
  });

  return schema.parse(data);
};
