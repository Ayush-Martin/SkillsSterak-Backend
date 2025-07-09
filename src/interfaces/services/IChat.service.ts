import { IChat } from "../../models/Chat.model";
import { IMessage } from "../../models/Message.model";
import { messageReactions } from "../../types/messageTypes";

/**
 * Service interface for chat-related business logic.
 * Supports group and individual messaging, chat participation, and reactions.
 */
export interface IChatService {
  /**
   * Creates a group chat for a course with a trainer.
   * Enables collaborative discussions and course-wide communication.
   */
  createGroupChat(courseId: string, trainerId: string): Promise<void>;

  /**
   * Creates an individual chat between a user and a trainer.
   * Supports private messaging and direct support.
   */
  createIndividualChat(userId: string, trainerId: string): Promise<IChat>;

  /**
   * Allows a user to join a chat for a specific course.
   * Enables dynamic participation and access control.
   */
  joinChat(userId: string, courseId: string): Promise<void>;

  /**
   * Retrieves all chats for a user.
   * Supports chat list views and notification features.
   */
  getChats(userId: string): Promise<Array<IChat>>;

  /**
   * Adds a new message to a chat.
   * Supports real-time communication and content sharing.
   */
  addNewMessage(
    userId: string,
    chatId: string,
    message: string,
    messageType: "text" | "image" | "emoji"
  ): Promise<void>;

  /**
   * Retrieves all messages for a chat.
   * Enables chat history display and conversation continuity.
   */
  getMessages(chatId: string): Promise<Array<IMessage>>;

  /**
   * Adds or updates a user's reaction to a message in a chat.
   * Supports engagement and feedback in chat conversations.
   */
  reactMessage(
    userId: string,
    messageId: string,
    chatId: string,
    reaction: messageReactions
  ): Promise<void>;

  getChatMembers(chatId: string): Promise<IChat>;
}
