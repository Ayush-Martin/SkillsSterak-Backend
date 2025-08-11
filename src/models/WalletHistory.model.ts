import { Document, model, ObjectId, Schema } from "mongoose";

export interface IWalletHistory extends Document {
  userId: ObjectId;
  amount: number;
  type: "credit" | "debit";
}

const WalletHistorySchema = new Schema<IWalletHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
  },
  { timestamps: true }
);

export default model<IWalletHistory>("WalletHistory", WalletHistorySchema);
