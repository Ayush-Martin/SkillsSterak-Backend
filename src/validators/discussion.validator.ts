import { z } from "zod";
import { ReplyValidationRule } from "./rules/review.validationRule";

export const addDiscussionValidator = (data: any) => {
  const schema = z.object({
    refId: z.string(),
    refType: z.enum(["lesson", "liveSession"]),
    content: z.string(),
  });

  return schema.parse(data);
};

export const addReplyValidator = (data: any) => {
  const schema = z.object({
    content: ReplyValidationRule,
  });

  return schema.parse(data);
};

export const getDiscussionValidator = (data: any) => {
  const schema = z.object({
    refId: z.string(),
    refType: z.enum(["lesson", "liveSession"]),
  });

  return schema.parse(data);
};

export const editDiscussionValidator = (data: any) => {
  const schema = z.object({
    content: z.string(),
  });

  return schema.parse(data);
};
