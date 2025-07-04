import { IMessage } from "../../models/Message.model";
import { messageReactions } from "../../types/messageTypes";

export interface IMessageService {
  /**
   * Persists a new message in a chat. Used to enable real-time communication and maintain chat history.
   */
  addNewMessage(
    userId: string,
    chatId: string,
    message: string,
    messageType: "text" | "image"
  ): Promise<void>;

  /**
   * Adds or updates a user's reaction to a message. Used for engagement, feedback, and chat interactivity.
   */
  reactMessage(
    userId: string,
    messageId: string,
    reaction: messageReactions
  ): Promise<void>;
}
