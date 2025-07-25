import { Document, ObjectId, Schema, model } from "mongoose";

export type ITransactionStatus =
  | "pending"
  | "completed"
  | "canceled"
  | "failed"
  | "on_process";

export type ITransactionType =
  | "course_purchase"
  | "commission"
  | "subscription"
  | "wallet_redeem"
  | "wallet_add";

export interface ITransaction extends Document {
  payerId?: ObjectId;
  receiverId?: ObjectId;
  amount: number;
  adminCommission?: number;
  type: ITransactionType;
  method?: "wallet" | "stripe";
  status: ITransactionStatus;
  courseId?: ObjectId;
  cancelTime?: Date;
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
      enum: [
        "course_purchase",
        "commission",
        "subscription",
        "wallet_redeem",
        "wallet_add",
      ],
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: false,
    },
    method: {
      type: String,
      enum: ["wallet", "stripe"],
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "canceled", "failed", "on_process"],
    },
    adminCommission: {
      type: Number,
      required: false,
    },
    cancelTime: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model("transition", TransactionSchema);
