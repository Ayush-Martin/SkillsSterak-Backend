import z from "zod";
import {
  PageRecordSizeValidationRule,
  PageValidationRule,
  SearchValidationRule,
} from "./rules/pagination.validationRule";

export const pageValidator = (data: any) => {
  const schema = z.object({
    page: PageValidationRule,
    size: PageRecordSizeValidationRule,
  });

  return schema.parse(data);
};

export const paginatedGetDataValidator = (data: any) => {
  const schema = z.object({
    page: PageValidationRule,
    search: SearchValidationRule,
    size: PageRecordSizeValidationRule,
  });

  return schema.parse(data);
};
