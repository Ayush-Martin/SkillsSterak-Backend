import mongoose, { Model, Mongoose, ObjectId } from "mongoose";
import { IChatRepository } from "../interfaces/repositories/IChat.repository";
import { IChat } from "../models/Chat.model";
import BaseRepository from "./Base.repository";

class ChatRepository extends BaseRepository<IChat> implements IChatRepository {
  constructor(private Chat: Model<IChat>) {
    super(Chat);
  }

  public async addMemberToChat(
    courseId: string,
    userId: string
  ): Promise<void> {
    await this.Chat.updateOne({ courseId }, { $addToSet: { members: userId } });
  }

  public async getChats(userId: string): Promise<Array<IChat>> {
    return await this.Chat.aggregate([
      {
        $match: {
          members: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                icon: "$thumbnail",
                title: 1,
              },
            },
          ],
          as: "course",
        },
      },
      {
        $unwind: {
          path: "$course",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          otherMember: {
            $first: {
              $filter: {
                input: "$members",
                as: "member",
                cond: {
                  $ne: ["$$member", new mongoose.Types.ObjectId(userId)],
                },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "otherMember",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                icon: "$profileImage",
                username: 1,
              },
            },
          ],
          as: "otherMember",
        },
      },
      {
        $unwind: "$otherMember",
      },
      {
        $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "chatId",
          pipeline: [
            {
              $sort: {
                createdAt: -1,
              },
            },
            {
              $limit: 1,
            },
            {
              $project: {
                createdAt: 1,
                message: {
                  $cond: [
                    { $eq: ["$messageType", "text"] },
                    "$message",
                    "image",
                  ],
                },
              },
            },
          ],
          as: "lastMessage",
        },
      },
      {
        $unwind: {
          path: "$lastMessage",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          "lastMessage.createdAt": -1,
        },
      },
      {
        $project: {
          _id: 1,
          chatType: 1,
          course: 1,
          otherMember: 1,
          lastMessage: "$lastMessage.message",
          lastMessageTime: "$lastMessage.createdAt",
        },
      },
    ]);
  }

  public async getChatMembers(chatId: string): Promise<Array<ObjectId>> {
    const chatMembers = await this.Chat.findOne(
      { _id: chatId },
      { members: 1 }
    );

    if (!chatMembers) return [];

    return chatMembers?.members;
  }

  public async getIndividualChat(
    chatId: string,
    userId: string
  ): Promise<IChat> {
    const chat = await this.Chat.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(chatId),
        },
      },
      {
        $unwind: {
          path: "$course",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          otherMember: {
            $first: {
              $filter: {
                input: "$members",
                as: "member",
                cond: {
                  $ne: ["$$member", new mongoose.Types.ObjectId(userId)],
                },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "otherMember",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                icon: "$profileImage",
                username: 1,
              },
            },
          ],
          as: "otherMember",
        },
      },
      {
        $unwind: "$otherMember",
      },
      {
        $project: {
          _id: 1,
          chatType: 1,
          otherMember: 1,
          lastMessage: "",
        },
      },
    ]);

    return chat[0];
  }

  public async getChatMembersDetails(chatId: string): Promise<IChat> {
    const chat = await this.Chat.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(chatId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "memberDetails",
        },
      },
      {
        $project: {
          _id: 0,
          members: {
            $map: {
              input: "$memberDetails",
              as: "user",
              in: {
                _id: "$$user._id",
                username: "$$user.username",
                profileImage: "$$user.profileImage",
                isAdmin: {
                  $eq: ["$adminId", "$$user._id"],
                },
              },
            },
          },
        },
      },
    ]);

    console.log(chat[0]);

    return chat[0].members;
  }
}

export default ChatRepository;
