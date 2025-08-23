import { z } from "zod";
import { DiscussionValidationRule } from "../constants/validationRule";

export const addDiscussionValidator = (data: any) => {
  const schema = z.object({
    refId: DiscussionValidationRule.refId,
    refType: DiscussionValidationRule.refType,
    content: DiscussionValidationRule.content,
  });

  return schema.parse(data);
};

export const addReplyValidator = (data: any) => {
  const schema = z.object({
    content: DiscussionValidationRule.reply.content,
  });

  return schema.parse(data);
};

export const getDiscussionValidator = (data: any) => {
  const schema = z.object({
    refId: DiscussionValidationRule.refId,
    refType: DiscussionValidationRule.refType,
  });

  return schema.parse(data);
};

export const editDiscussionValidator = (data: any) => {
  const schema = z.object({
    content: DiscussionValidationRule.content,
  });

  return schema.parse(data);
};
