import { string, z } from "zod";
import {
  CategoryNameValidationRule
} from "../utils/validationRules";

export const addCategoryValidator = (data: any) => {
  const schema = z.object({
    categoryName: CategoryNameValidationRule,
  });

  return schema.parse(data);
};

export const editCategoryValidator = addCategoryValidator;
