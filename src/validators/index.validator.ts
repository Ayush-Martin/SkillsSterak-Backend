import z from "zod";

export const pageValidator = (data: any) => {
  const schema = z.object({
<<<<<<< HEAD
    page: z.number().min(1).default(1),
=======
    page: z.preprocess((val) => Number(val), z.number().default(1)),
>>>>>>> main
  });

  return schema.parse(data);
};
