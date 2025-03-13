import { z } from "zod";
import {
  LessonDescriptionValidationRule,
  LessonTitleValidationRule,
  LessonTypeValidationRule,
} from "../utils/validationRules";

export const addLessonValidator = (data: any) => {
  const schema = z.object({
    title: LessonTitleValidationRule,
    description: LessonDescriptionValidationRule,
    type: LessonTypeValidationRule,
  });

  return schema.parse(data);
};

export const updateLessonDetailsValidator = (data: any) => {
  const schema = z.object({
    title: LessonTitleValidationRule,
    description: LessonDescriptionValidationRule,
  });

  return schema.parse(data);
};
