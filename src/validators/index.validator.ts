import z from "zod";

export const pageValidator = (data: any) => {
  const schema = z.object({
    page: z.preprocess((val) => Number(val), z.number().default(1)),
  });

  return schema.parse(data);
};

export const paginatedGetDataValidator = (data: any) => {
  const schema = z.object({
    page: z.preprocess((val) => Number(val), z.number().default(1)),
    search: z.string(),
  });

  return schema.parse(data);
};

export const razorpayCompletePurchaseValidator = (data: any) => {
  const schema = z.object({
    orderId: z.string(),
  });

  return schema.parse(data);
};
