import { io } from "..";
import { IChatRepository } from "../interfaces/repositories/IChat.repository";
import { IMessageRepository } from "../interfaces/repositories/IMessage.repository";
import { IMessageService } from "../interfaces/services/IMessage.service";
import { messageReactions } from "../types/messageTypes";
import { getObjectId } from "../utils/objectId";

class MessageService implements IMessageService {
  constructor(
    private _messageRepository: IMessageRepository,
    private _chatRepository: IChatRepository
  ) {}

  public async addNewMessage(
    userId: string,
    chatId: string,
    message: string,
    messageType: "text" | "image"
  ): Promise<void> {
    const members = await this._chatRepository.getChatMembers(chatId);
    const newMessage = await this._messageRepository.create({
      sender: getObjectId(userId),
      chatId: getObjectId(chatId),
      message,
      messageType,
      reactions: [],
    });

    io.to(members as unknown as string[]).emit("message:New", newMessage);
  }

  public async reactMessage(
    userId: string,
    messageId: string,
    reaction: messageReactions
  ): Promise<void> {
    await this._messageRepository.reactMessage(userId, messageId, reaction);
  }
}

export default MessageService;
