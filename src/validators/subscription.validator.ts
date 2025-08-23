import z, { string } from "zod";
import {
  PaginationValidationRule,
  SubscriptionPlanFilterValidationRule,
  SubscriptionPlanValidationRule,
} from "../constants/validationRule";

export const createSubscriptionPlanIdValidator = (data: any) => {
  const schema = z.object({
    title: SubscriptionPlanValidationRule.title,
    description: SubscriptionPlanValidationRule.description,
    price: SubscriptionPlanValidationRule.price,
    duration: SubscriptionPlanValidationRule.duration,
    features: SubscriptionPlanValidationRule.features,
  });
  return schema.parse(data);
};

export const editSubscriptionPlanIdValidator =
  createSubscriptionPlanIdValidator;

export const checkUserAccessToFeatureValidator = (data: any) => {
  const schema = z.object({
    featureId: SubscriptionPlanValidationRule.features,
  });
  return schema.parse(data);
};

export const getSubscribedUsersValidator = (data: any) => {
  const schema = z.object({
    page: PaginationValidationRule.page,
    size: PaginationValidationRule.size,
    search: PaginationValidationRule.search,
    subscriptionPlanId: SubscriptionPlanFilterValidationRule.subscriptionPlanId,
  });
  return schema.parse(data);
};
