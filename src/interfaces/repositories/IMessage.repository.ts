import { IMessage } from "../../models/Message.model";
import { messageReactions } from "../../types/messageTypes";
import { IBaseRepository } from "./IBase.repository";

export interface IMessageRepository extends IBaseRepository<IMessage> {
  /** Get all messages in a chat */
  getChatMessages(chatId: string): Promise<Array<IMessage>>;
  reactMessage(
    userId: string,
    messageId: string,
    reaction: messageReactions
  ): Promise<IMessage | null>;
}
