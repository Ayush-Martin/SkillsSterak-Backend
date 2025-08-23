import z from "zod";
import {
  PaginationValidationRule,
  TransactionFilterSortValidationRule,
} from "../constants/validationRule";

export const getAdminRevenueValidator = (data: any) => {
  const schema = z.object({
    page: PaginationValidationRule.page,
    size: PaginationValidationRule.size,
    filterType: TransactionFilterSortValidationRule.filterType,
    startDate: TransactionFilterSortValidationRule.startDate,
    endDate: TransactionFilterSortValidationRule.endDate,
  });

  return schema.parse(data);
};

export const exportAdminRevenueValidator = (data: any) => {
  const schema = z.object({
    filterType: TransactionFilterSortValidationRule.filterType,
    startDate: TransactionFilterSortValidationRule.startDate,
    endDate: TransactionFilterSortValidationRule.endDate,
    exportType: TransactionFilterSortValidationRule.exportType,
  });

  return schema.parse(data);
};

export const getTrainerRevenueValidator = getAdminRevenueValidator;
export const exportTrainerRevenueValidator = exportAdminRevenueValidator;

export const getTransactionValidator = (data: any) => {
  const schema = z.object({
    page: PaginationValidationRule.page,
    size: PaginationValidationRule.size,
    search: PaginationValidationRule.search,
    status: TransactionFilterSortValidationRule.status,
    type: TransactionFilterSortValidationRule.type,
  });

  return schema.parse(data);
};
