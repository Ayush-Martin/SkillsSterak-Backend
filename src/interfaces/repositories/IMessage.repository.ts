import { IMessage } from "../../models/Message.model";
import { messageReactions } from "../../types/messageTypes";
import { IBaseRepository } from "./IBase.repository";

/**
 * Repository interface for chat message operations.
 * Supports message retrieval and user interaction features in chats.
 */
export interface IMessageRepository extends IBaseRepository<IMessage> {
  /**
   * Retrieves all messages for a given chat.
   * Enables chat history display and conversation continuity.
   */
  getChatMessages(chatId: string): Promise<Array<IMessage>>;

  /**
   * Adds or updates a user's reaction to a message.
   * Supports real-time feedback and engagement in chat conversations.
   */
  reactMessage(
    userId: string,
    messageId: string,
    reaction: messageReactions
  ): Promise<IMessage | null>;
}
