import { z } from "zod";
import { ReviewValidationRule } from "../constants/validationRule";

export const addReviewValidator = (data: any) => {
  const schema = z.object({
    content: ReviewValidationRule.content,
    rating: ReviewValidationRule.rating,
  });

  return schema.parse(data);
};

export const addReplyValidator = (data: any) => {
  const schema = z.object({
    content: ReviewValidationRule.reply.content,
  });

  return schema.parse(data);
};

export const updateReviewValidator = addReviewValidator;
