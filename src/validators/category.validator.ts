import { z } from "zod";
import { CategoryNameValidationRule } from "./rules/course.validationRule";

export const addCategoryValidator = (data: any) => {
  const schema = z.object({
    categoryName: CategoryNameValidationRule,
  });

  return schema.parse(data);
};

export const editCategoryValidator = addCategoryValidator;
