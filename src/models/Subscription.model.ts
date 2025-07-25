import { Document, ObjectId, Schema, model } from "mongoose";

export interface ISubscription extends Document {
  userId: ObjectId;
  transactionId: ObjectId;
  subscriptionPlanId: ObjectId;
  startDate: Date;
  endDate: Date;
  active: boolean;
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
  },
  { timestamps: true }
);

export default model("subscription", SubscriptionSchema);
