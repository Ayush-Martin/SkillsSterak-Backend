import z, { string } from "zod";
import {
  PageRecordSizeValidationRule,
  PageValidationRule,
  SearchValidationRule,
} from "./rules/pagination.validationRule";

export const createSubscriptionPlanIdValidator = (data: any) => {
  const schema = z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    duration: z.number(),
  });
  return schema.parse(data);
};

export const editSubscriptionPlanIdValidator =
  createSubscriptionPlanIdValidator;

export const getSubscribedUsersValidator = (data: any) => {
  const schema = z.object({
    page: PageValidationRule,
    size: PageRecordSizeValidationRule,
    search: SearchValidationRule,
    subscriptionPlanId: z.string().optional(),
  });
  return schema.parse(data);
};
