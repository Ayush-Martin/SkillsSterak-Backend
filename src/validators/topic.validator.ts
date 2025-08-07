import z from "zod";

export const addTopicValidator = (data: any) => {
  const schema = z.object({
    title: z.string(),
  });

  return schema.parse(data);
};

export const editTopicValidator = addTopicValidator;
