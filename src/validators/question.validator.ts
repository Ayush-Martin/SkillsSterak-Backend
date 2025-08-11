import { z } from "zod";

export const addQuestionValidator = (data: any) => {
  const schema = z.object({
    question: z.string(),
    answer: z.string(),
    options: z.array(z.object({ choice: z.string(), id: z.string() })).min(2),
  });

  return schema.parse(data);
};

export const editQuestionValidator = addQuestionValidator;
