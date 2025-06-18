import { Schema, Document, model, ObjectId } from "mongoose";

export interface IMessage extends Document {
  sender: ObjectId;
  chatId: ObjectId;
  message: string;
  messageType: "text" | "image";
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "chats",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      default: "text",
    },
  },
  { timestamps: true }
);

export default model("messages", MessageSchema);
