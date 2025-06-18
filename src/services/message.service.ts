import { io } from "..";
import { IChatRepository } from "../interfaces/repositories/IChat.repository";
import { IMessageRepository } from "../interfaces/repositories/IMessage.repository";
import { IMessageService } from "../interfaces/services/IMessage.service";
import { IMessage } from "../models/Message.model";
import { getObjectId } from "../utils/objectId";

class MessageService implements IMessageService {
  constructor(
    private messageRepository: IMessageRepository,
    private chatRepository: IChatRepository
  ) {}

  public async addNewMessage(
    userId: string,
    chatId: string,
    message: string,
    messageType: "text" | "image"
  ): Promise<void> {
    const members = await this.chatRepository.getChatMembers(chatId);
    const newMessage = await this.messageRepository.create({
      sender: getObjectId(userId),
      chatId: getObjectId(chatId),
      message,
      messageType,
    });

    io.to(members as unknown as string[]).emit("message:New", newMessage);
  }

  
}

export default MessageService;
