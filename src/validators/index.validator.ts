import z from "zod";

export const pageValidator = (data: any) => {
  const schema = z.object({
    page: z.number().min(1).default(1),
  });

  return schema.parse(data);
};
