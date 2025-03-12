import { Document, ObjectId, Schema, model } from "mongoose";

export interface ITransaction extends Document {
  payerId: ObjectId;
  receiverId?: ObjectId;
  amount: number;
  type: "payment" | "commission" | "subscription" | "redeem";
  transactionId: string;
  courseId?: ObjectId;
}

const TransactionSchema = new Schema<ITransaction>({
  payerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
    enum: ["payment", "commission", "subscription", "redeem"],
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "course",
    required: false,
  },
});

export default model("transition", TransactionSchema);
