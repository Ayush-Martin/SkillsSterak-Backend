import { Document, ObjectId, Schema, model } from "mongoose";

export interface IPremiumMessage extends Document {
  chatId: ObjectId;
  senderId: ObjectId;
  receiverId: ObjectId;
  message: string;
  messageType: "text" | "image";
}

const PremiumMessageSchema = new Schema<IPremiumMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "premiumChat",
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    message: String,
    messageType: {
      type: String,
      enum: ["text", "image"],
      default: "text",
    },
  },
  { timestamps: true }
);

export default model<IPremiumMessage>("premiumMessage", PremiumMessageSchema);
