import { model, ObjectId, Schema } from "mongoose";

export interface IWallet extends Document {
  userId: ObjectId;
  balance: number;
}

const WalletSchema = new Schema<IWallet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      unique: true,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default model("wallet", WalletSchema);
