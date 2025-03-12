import { Document, ObjectId, Schema, model } from "mongoose";

export interface ISubscription extends Document {
  userId: ObjectId;
  transactionId: ObjectId;
  startDate?: Date;
  endDate: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
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
  },
  { timestamps: true }
);

export default model("subscription", SubscriptionSchema);
