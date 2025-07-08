import { ObjectId } from "mongoose";
import { IChat } from "../../models/Chat.model";
import BaseRepository from "../../repositories/Base.repository";

/**
 * Repository interface for chat-related data operations.
 * Supports collaborative and individual chat management for courses and users.
 */
export interface IChatRepository extends BaseRepository<IChat> {
  /**
   * Adds a user as a member to a course chat.
   * Enables dynamic participation in course discussions and group messaging.
   */
  addMemberToChat(courseId: string, userId: string): Promise<void>;

  /**
   * Retrieves all chats associated with a user.
   * Supports chat list views and notification features.
   */
  getChats(userId: string): Promise<Array<IChat>>;

  /**
   * Retrieves a specific chat for a user, ensuring access control.
   * Used for direct messaging or private chat sessions.
   */
  getIndividualChat(chatId: string, userId: string): Promise<IChat>;

  /**
   * Returns all member IDs for a given chat.
   * Useful for displaying participant lists or managing group permissions.
   */
  getChatMembers(chatId: string): Promise<Array<ObjectId>>;

  getChatMembersDetails(chatId: string): Promise<IChat>;
}
