import { Schema, Document, model, ObjectId } from "mongoose";
import { messageReactions } from "../types/messageTypes";

interface IMessageReaction {
  userId: ObjectId;
  emoji: messageReactions;
}

export interface IMessage extends Document {
  sender: ObjectId;
  chatId: ObjectId;
  message: string;
  messageType: "text" | "image" | "emoji";
  reactions: IMessageReaction[];
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
      enum: ["text", "image", "emoji"],
      default: "text",
    },
    reactions: {
      type: [
        {
          userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          emoji: {
            type: String,
            enum: ["😂", "❤️", "👍", "👎", "🔥"],
            required: true,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default model("messages", MessageSchema);
