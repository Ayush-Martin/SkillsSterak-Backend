import { z } from "zod";
import { CategoryValidationRule } from "../constants/validationRule";

export const addCategoryValidator = (data: any) => {
  const schema = z.object({
    categoryName: CategoryValidationRule.categoryName,
  });

  return schema.parse(data);
};

export const editCategoryValidator = addCategoryValidator;
