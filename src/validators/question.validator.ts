import { z } from "zod";
import { QuestionValidationRule } from "../constants/validationRule";

export const addQuestionValidator = (data: any) => {
  const schema = z.object({
    question: QuestionValidationRule.question,
    answer: QuestionValidationRule.answer,
    options: QuestionValidationRule.options,
  });

  return schema.parse(data);
};

export const editQuestionValidator = addQuestionValidator;
