import { Document, ObjectId, Schema, model } from "mongoose";
import {
  ISubscriptionFeatureId,
  SUBSCRIPTION_FEATURE_IDS,
} from "../constants/general";

export interface ISubscription extends Document {
  userId: ObjectId;
  transactionId: ObjectId;
  subscriptionPlanId: ObjectId;
  startDate: Date;
  endDate: Date;
  amount: number;
  active: boolean;
  features: ISubscriptionFeatureId[];
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscriptionPlanId: {
      type: Schema.Types.ObjectId,
      ref: "subscriptionplans",
      required: true,
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "transactions",
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now(),
    },
    endDate: {
      type: Date,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },

    amount: {
      type: Number,
      required: true,
    },

    features: [
      {
        type: String,
        enum: Object.values(SUBSCRIPTION_FEATURE_IDS),
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export default model("subscription", SubscriptionSchema);
