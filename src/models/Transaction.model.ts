import { Document, ObjectId, Schema, model } from "mongoose";

export interface ITransaction extends Document {
  payerId?: ObjectId;
  receiverId?: ObjectId;
  amount: number;
  type: "payment" | "commission" | "subscription" | "refund";
  courseId?: ObjectId;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    payerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["payment", "commission", "subscription", "refund"],
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model("transition", TransactionSchema);
