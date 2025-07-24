import z from "zod";

export const ScheduleLiveSessionValidator = (data: any) => {
  const schema = z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    time: z.string(),
  });

  return schema.parse(data);
};
