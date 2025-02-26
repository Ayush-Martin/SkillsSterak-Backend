import { string, z } from "zod";

export const addCategoryValidator = (data: any) => {
  const schema = z.object({
    categoryName: z
      .string()
      .min(3, "category name must have at least 3 characters")
      .max(20, "category name must be within 20 characters"),
  });

  return schema.parse(data);
};

export const editCategoryValidator = (data: any) => {
  const schema = z.object({
    categoryName: z
      .string()
      .min(3, "category name must have at least 3 characters")
      .max(20, "category name must be within 20 characters"),
  });

  return schema.parse(data);
};

export const getCategoriesValidator = (data: any) => {
  const schema = z.object({
    search: z.string().default(""),
    page: z.preprocess((val) => Number(val), z.number().default(1)),
  });

  return schema.parse(data);
};
