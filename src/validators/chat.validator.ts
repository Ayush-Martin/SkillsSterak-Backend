import { z } from "zod";

export const sendMediaValidator = (data: any) => {
  const schema = z.object({
    receiverId: z.string(),
  });
  return schema.parse(data);
};
