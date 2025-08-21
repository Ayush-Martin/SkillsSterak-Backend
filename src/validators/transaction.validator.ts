import z from "zod";
import {
  PageRecordSizeValidationRule,
  PageValidationRule,
  SearchValidationRule,
} from "./rules/pagination.validationRule";
import {
  TransactionRevenueExportType,
  TransactionRevenueFilterEndDateValidationRule,
  TransactionRevenueFilterStartDateValidationRule,
  TransactionRevenueFilterTypeValidationRule,
} from "./rules/transaction.validationRule";

export const getAdminRevenueValidator = (data: any) => {
  const schema = z.object({
    page: PageValidationRule,
    size: PageRecordSizeValidationRule,
    filterType: TransactionRevenueFilterTypeValidationRule,
    startDate: TransactionRevenueFilterStartDateValidationRule,
    endDate: TransactionRevenueFilterEndDateValidationRule,
  });

  return schema.parse(data);
};

export const exportAdminRevenueValidator = (data: any) => {
  const schema = z.object({
    filterType: TransactionRevenueFilterTypeValidationRule,
    startDate: TransactionRevenueFilterStartDateValidationRule,
    endDate: TransactionRevenueFilterEndDateValidationRule,
    exportType: TransactionRevenueExportType,
  });

  return schema.parse(data);
};

export const getTrainerRevenueValidator = getAdminRevenueValidator;
export const exportTrainerRevenueValidator = exportAdminRevenueValidator;

export const getTransactionValidator = (data: any) => {
  const schema = z.object({
    page: PageValidationRule,
    size: PageRecordSizeValidationRule,
    search: SearchValidationRule,
    status: z.enum([
      "all",
      "pending",
      "completed",
      "canceled",
      "failed",
      "on_process",
    ]),
    type: z.enum([
      "all",
      "course_purchase",
      "commission",
      "subscription",
      "wallet_redeem",
    ]),
  });

  return schema.parse(data);
};
