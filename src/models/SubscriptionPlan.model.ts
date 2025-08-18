import { Document, Schema, model } from "mongoose";
import {
  ISubscriptionFeatureId,
  SUBSCRIPTION_FEATURE_IDS,
} from "../constants/general";

export interface ISubscriptionPlan extends Document {
  title: string;
  price: number;
  description: string;
  duration: number;
  isListed: boolean;
  features: ISubscriptionFeatureId[];
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  isListed: {
    type: Boolean,
    default: false,
  },
  features: [
    {
      type: String,
      enum: Object.values(SUBSCRIPTION_FEATURE_IDS),
      required: true,
    },
  ],
});

export default model<ISubscriptionPlan>(
  "subscriptionPlans",
  SubscriptionPlanSchema
);
