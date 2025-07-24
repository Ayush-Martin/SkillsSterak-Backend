import z from "zod";

export const createSubscriptionPlanIdValidator = (data: any) => {
  const schema = z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    duration: z.number(),
  });
  return schema.parse(data);
};

export const editSubscriptionPlanIdValidator =
  createSubscriptionPlanIdValidator;
