import { Document, ObjectId, Schema, model } from "mongoose";

export interface IPremiumChat extends Document {
  userId: ObjectId;
  trainerId: ObjectId;
}

const PremiumChatSchema = new Schema<IPremiumChat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    trainerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default model<IPremiumChat>("premiumChat", PremiumChatSchema);
