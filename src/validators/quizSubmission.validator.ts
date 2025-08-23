import { z } from "zod";
import { QuizSubmissionValidationRule } from "../constants/validationRule";

export const submitQuizValidator = (data: any) => {
  const schema = z.object({
    timeTaken: QuizSubmissionValidationRule.timeTaken,
    answers: QuizSubmissionValidationRule.answers,
  });

  return schema.parse(data);
};

export const resubmitQuizValidator = submitQuizValidator;
