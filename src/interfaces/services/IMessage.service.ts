import { IMessage } from "../../models/Message.model";

export interface IMessageService {
  /** Retrieves all messages for a specific chat. */
  addNewMessage(
    userId: string,
    chatId: string,
    message: string,
    messageType: "text" | "image"
  ): Promise<void>;
  
}
