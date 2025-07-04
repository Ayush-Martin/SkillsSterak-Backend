import { IChat } from "../../models/Chat.model";
import { IMessage } from "../../models/Message.model";
import { messageReactions } from "../../types/messageTypes";

export interface IChatService {
  /** Create a group chat for a course with a trainer */
  createGroupChat(courseId: string, trainerId: string): Promise<void>;
  /** Create an individual chat between a user and a trainer */
  createIndividualChat(userId: string, trainerId: string): Promise<IChat>;
  /** Join a chat for a user and course */
  joinChat(userId: string, courseId: string): Promise<void>;
  /** Get all chats for a user */
  getChats(userId: string): Promise<Array<IChat>>;
  /** Add a new message to a chat */
  addNewMessage(
    userId: string,
    chatId: string,
    message: string,
    messageType: "text" | "image"
  ): Promise<void>;
  /** Get all messages for a chat */
  getMessages(chatId: string): Promise<Array<IMessage>>;

  reactMessage(
    userId: string,
    messageId: string,
    chatId: string,
    reaction: messageReactions
  ): Promise<void>;
}
