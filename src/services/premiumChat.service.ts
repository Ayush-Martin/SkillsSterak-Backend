import { IPremiumChatRepository } from "../interfaces/repositories/IPremiumChat.repository";
import { IPremiumMessageRepository } from "../interfaces/repositories/IPremiumMessage.repository";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { io } from "..";
import { getObjectId } from "../utils/objectId";
import { IPremiumChatService } from "../interfaces/services/IPremiumChat.service";
import { IPremiumChat } from "../models/PremiumChat.model";
import { IPremiumMessage } from "../models/PremiumMessage.model";

class PremiumChatService implements IPremiumChatService {
  constructor(
    private premiumChatRepository: IPremiumChatRepository,
    private premiumMessageRepository: IPremiumMessageRepository,
    private userRepository: IUserRepository
  ) {}

  public async addMessage(
    message: string,
    senderId: string,
    receiverId: string,
    chatId: string | null,
    messageType: "image" | "text" = "text"
  ): Promise<void> {
    if (!chatId) {
      const chat = await this.premiumChatRepository.create({
        userId: getObjectId(senderId),
        trainerId: getObjectId(receiverId),
      });

      const user = await this.userRepository.findById(senderId);
      const trainer = await this.userRepository.findById(receiverId);
      io.to(senderId).emit("new chat", {
        ...chat.toObject(),
        name: trainer?.username,
      });
      io.to(receiverId).emit("new chat", {
        ...chat.toObject(),
        name: user?.username,
      });
      chatId = chat.id as string;
    }

    const newMessage = await this.premiumMessageRepository.create({
      senderId: getObjectId(senderId),
      receiverId: getObjectId(receiverId),
      chatId: getObjectId(chatId),
      message,
      messageType,
    });
    console.log(senderId, receiverId, chatId, message);
    io.to([senderId, receiverId]).emit("new message", newMessage);
  }

  public async getTrainerChats(
    trainerId: string
  ): Promise<Array<IPremiumChat>> {
    return await this.premiumChatRepository.getTrainerChats(trainerId);
  }

  public async getUserChats(userId: string): Promise<Array<IPremiumChat>> {
    return await this.premiumChatRepository.getUserChats(userId);
  }

  public async getMessages(chatId: string): Promise<Array<IPremiumMessage>> {
    return await this.premiumMessageRepository.getMessages(chatId);
  }
}

export default PremiumChatService;
