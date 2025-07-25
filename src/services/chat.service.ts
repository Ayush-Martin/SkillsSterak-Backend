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
    private _chatRepository: IChatRepository,
    private _messageRepository: IMessageRepository,
    private _userRepository: IUserRepository
  ) {}

  public async createGroupChat(
    courseId: string,
    trainerId: string
  ): Promise<void> {
    await this._chatRepository.create({
      chatType: "group",
      courseId: getObjectId(courseId),
      adminId: getObjectId(trainerId),
      members: [getObjectId(trainerId)],
    });
  }

  public async joinChat(userId: string, courseId: string): Promise<void> {
    await this._chatRepository.addMemberToChat(courseId, userId);
  }

  public async getChats(userId: string): Promise<Array<IChat>> {
    return await this._chatRepository.getChats(userId);
  }

  public async addNewMessage(
    userId: string,
    chatId: string,
    message: string,
    messageType: "text" | "image" | "emoji"
  ): Promise<void> {
    const members = await this._chatRepository.getChatMembers(chatId);
    const newMessage = await this._messageRepository.create({
      sender: getObjectId(userId),
      chatId: getObjectId(chatId),
      message,
      messageType,
    });

    const user = await this._userRepository.findById(userId);

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
      lastMessage:
        messageType === "text"
          ? message
          : messageType == "emoji"
          ? "emoji"
          : "image",
      lastMessageTime: (newMessage as any).createdAt,
      chatId,
    });
  }

  public async getMessages(chatId: string): Promise<Array<IMessage>> {
    return await this._messageRepository.getChatMessages(chatId);
  }

  public async createIndividualChat(
    userId: string,
    trainerId: string
  ): Promise<IChat> {
    const chat = await this._chatRepository.create({
      chatType: "individual",
      members: [getObjectId(userId), getObjectId(trainerId)],
    });

    const userChat = await this._chatRepository.getIndividualChat(
      chat.id,
      userId
    );

    const trainerChat = await this._chatRepository.getIndividualChat(
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
    const message = await this._messageRepository.reactMessage(
      userId,
      messageId,
      reaction
    );

    const members = await this._chatRepository.getChatMembers(chatId);

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

  public async getChatMembers(chatId: string): Promise<IChat> {
    return await this._chatRepository.getChatMembersDetails(chatId);
  }
}

export default ChatService;
