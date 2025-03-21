import { IPremiumChat } from "../../models/PremiumChat.model";
import { IPremiumMessage } from "../../models/PremiumMessage.model";

export interface IPremiumChatService {
  addMessage(
    message: string,
    senderId: string,
    receiverId: string,
    chatId: string | null,
    messageType?: "image" | "text"
  ): Promise<void>;
  getTrainerChats(trainerId: string): Promise<Array<IPremiumChat>>;
  getUserChats(userId: string): Promise<Array<IPremiumChat>>;
  getMessages(chatId: string): Promise<Array<IPremiumMessage>>;
}
