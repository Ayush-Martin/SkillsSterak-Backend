import { z } from "zod";
import {
  ReplyValidationRule,
  ReviewContentValidationRule,
  ReviewRatingValidationRule,
} from "./rules/review.validationRule";

export const addReviewValidator = (data: any) => {
  const schema = z.object({
    content: ReviewContentValidationRule,
    rating: ReviewRatingValidationRule,
  });

  return schema.parse(data);
};

export const addReplyValidator = (data: any) => {
  const schema = z.object({
    content: ReplyValidationRule,
  });

  return schema.parse(data);
};

export const updateReviewValidator = addReviewValidator;
