import z from "zod";
import { PaginationValidationRule } from "../constants/validationRule";

export const pageValidator = (data: any) => {
  const schema = z.object({
    page: PaginationValidationRule.page,
    size: PaginationValidationRule.size,
  });

  return schema.parse(data);
};

export const paginatedGetDataValidator = (data: any) => {
  const schema = z.object({
    page: PaginationValidationRule.page,
    search: PaginationValidationRule.search,
    size: PaginationValidationRule.size,
  });

  return schema.parse(data);
};

