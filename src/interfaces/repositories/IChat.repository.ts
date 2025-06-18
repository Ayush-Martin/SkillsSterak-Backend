
import { ObjectId } from "mongoose";
import { IChat } from "../../models/Chat.model";
import BaseRepository from "../../repositories/Base.repository";


export interface IChatRepository extends BaseRepository<IChat> {
  /** Add a member to a chat by course and user ID */
  addMemberToChat(courseId: string, userId: string): Promise<void>;
  /** Get all chats for a user */
  getChats(userId: string): Promise<Array<IChat>>;
  /** Get an individual chat for a user */
  getIndividualChat(chatId: string, userId: string): Promise<IChat>;
  /** Get all members of a chat */
  getChatMembers(chatId: string): Promise<Array<ObjectId>>;
}
