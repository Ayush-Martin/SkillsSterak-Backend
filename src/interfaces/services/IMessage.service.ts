import { IMessage } from "../../models/Message.model";
import { messageReactions } from "../../types/messageTypes";

export interface IMessageService {
  /** Retrieves all messages for a specific chat. */
  addNewMessage(
    userId: string,
    chatId: string,
    message: string,
    messageType: "text" | "image"
  ): Promise<void>;

  reactMessage(
    userId: string,
    messageId: string,
    reaction: messageReactions
  ): Promise<void>;
}
