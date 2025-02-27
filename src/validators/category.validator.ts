import { string, z } from "zod";
import {
  CategoryNameValidationRule,
  PageValidationRule,
  SearchValidationRule,
} from "../utils/validationRules";

export const addCategoryValidator = (data: any) => {
  const schema = z.object({
    categoryName: CategoryNameValidationRule,
  });

  return schema.parse(data);
};

export const editCategoryValidator = (data: any) => {
  const schema = z.object({
    categoryName: CategoryNameValidationRule,
  });

  return schema.parse(data);
};

export const getCategoriesValidator = (data: any) => {
  const schema = z.object({
    search: SearchValidationRule,
    page: PageValidationRule,
  });

  return schema.parse(data);
};
