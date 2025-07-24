import { Document, Schema, model } from "mongoose";

export interface ISubscriptionPlan extends Document {
  title: string;
  price: number;
  description: string;
  type: "monthly" | "yearly";
  duration: number;
  isListed: boolean;
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
  type: {
    type: String,
    enum: ["monthly", "yearly"],
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
});

export default model<ISubscriptionPlan>(
  "subscriptionPlans",
  SubscriptionPlanSchema
);
