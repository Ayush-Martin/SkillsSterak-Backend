import z from "zod";

export const TransactionRevenueFilterTypeValidationRule = z.enum([
  "daily",
  "monthly",
  "yearly",
  "all",
  "custom",
]);

export const TransactionRevenueFilterStartDateValidationRule = z.string();

export const TransactionRevenueFilterEndDateValidationRule = z.string();

export const TransactionRevenueExportType = z.enum(["pdf", "excel"]);
