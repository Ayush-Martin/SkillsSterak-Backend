import { IMessage } from "../../models/Message.model";
import { IBaseRepository } from "./IBase.repository";

export interface IMessageRepository extends IBaseRepository<IMessage> {
  /** Get all messages in a chat */
  getChatMessages(chatId: string): Promise<Array<IMessage>>;
}
