import z, { string } from "zod";
import {
  PageRecordSizeValidationRule,
  PageValidationRule,
  SearchValidationRule,
} from "./rules/pagination.validationRule";
import {
  ISubscriptionFeatureId,
  SUBSCRIPTION_FEATURE_IDS,
} from "../constants/general";

export const createSubscriptionPlanIdValidator = (data: any) => {
  const schema = z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    duration: z.number(),
    features: z.array(
      z.enum(
        Object.values(SUBSCRIPTION_FEATURE_IDS) as [
          ISubscriptionFeatureId,
          ...ISubscriptionFeatureId[]
        ]
      )
    ),
  });
  return schema.parse(data);
};

export const editSubscriptionPlanIdValidator =
  createSubscriptionPlanIdValidator;

export const checkUserAccessToFeatureValidator = (data: any) => {
  const schema = z.object({
    featureId: z.enum(
      Object.values(SUBSCRIPTION_FEATURE_IDS) as [
        ISubscriptionFeatureId,
        ...ISubscriptionFeatureId[]
      ]
    ),
  });
  return schema.parse(data);
};

export const getSubscribedUsersValidator = (data: any) => {
  const schema = z.object({
    page: PageValidationRule,
    size: PageRecordSizeValidationRule,
    search: SearchValidationRule,
    subscriptionPlanId: z.string().optional(),
  });
  return schema.parse(data);
};
