import { IChatRepository } from "../interfaces/repositories/IChat.repository";
import { IChatService } from "../interfaces/services/IChat.service";
import { getObjectId } from "../utils/objectId";
import { io } from "..";
import { IChat } from "../models/Chat.model";
import { IMessageRepository } from "../interfaces/repositories/IMessage.repository";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { IMessage } from "../models/Message.model";
import { SocketEvents } from "../constants/socketEvents";
import { messageReactions } from "../types/messageTypes";

class ChatService implements IChatService {
  constructor(
    private chatRepository: IChatRepository,
    private messageRepository: IMessageRepository,
    private userRepository: IUserRepository
  ) {}

  public async createGroupChat(
    courseId: string,
    trainerId: string
  ): Promise<void> {
    console.log("dfdfb-----df", trainerId);

    const chat = await this.chatRepository.create({
      chatType: "group",
      courseId: getObjectId(courseId),
      adminId: getObjectId(trainerId),
      members: [getObjectId(trainerId)],
    });
  }

  public async joinChat(userId: string, courseId: string): Promise<void> {
    await this.chatRepository.addMemberToChat(courseId, userId);
  }

  public async getChats(userId: string): Promise<Array<IChat>> {
    return await this.chatRepository.getChats(userId);
  }

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

    const user = await this.userRepository.findById(userId);

    io.to(members.map((x) => String(x))).emit(
      SocketEvents.CHAT_MESSAGE_BROADCAST,
      {
        ...newMessage.toObject(),
        sender: {
          _id: user?._id,
          username: user?.username,
          profileImage: user?.profileImage,
        },
      }
    );

    io.to(members.map((x) => String(x))).emit(SocketEvents.CHAT_LAST_MESSAGE, {
      lastMessage: messageType === "text" ? message : "image",
      lastMessageTime: (newMessage as any).createdAt,
      chatId,
    });
  }

  public async getMessages(chatId: string): Promise<Array<IMessage>> {
    return await this.messageRepository.getChatMessages(chatId);
  }

  public async createIndividualChat(
    userId: string,
    trainerId: string
  ): Promise<IChat> {
    const chat = await this.chatRepository.create({
      chatType: "individual",
      members: [getObjectId(userId), getObjectId(trainerId)],
    });

    const userChat = await this.chatRepository.getIndividualChat(
      chat.id,
      userId
    );

    const trainerChat = await this.chatRepository.getIndividualChat(
      chat.id,
      trainerId
    );

    io.to(trainerId).emit("chat", trainerChat);

    return userChat;
  }

  public async reactMessage(
    userId: string,
    messageId: string,
    chatId: string,
    reaction: messageReactions
  ): Promise<void> {
    const message = await this.messageRepository.reactMessage(
      userId,
      messageId,
      reaction
    );

    const members = await this.chatRepository.getChatMembers(chatId);

    io.to(members.map((x) => String(x))).emit(
      SocketEvents.CHAT_MESSAGE_REACTION_BROADCAST,
      {
        userId,
        messageId,
        chatId,
        reactions: message?.reactions,
      }
    );
  }
}

export default ChatService;
