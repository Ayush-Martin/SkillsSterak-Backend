import z from "zod";
import { TopicValidationRule } from "../constants/validationRule";

export const addTopicValidator = (data: any) => {
  const schema = z.object({
    topicName: TopicValidationRule.topicName,
  });

  return schema.parse(data);
};

export const editTopicValidator = addTopicValidator;
