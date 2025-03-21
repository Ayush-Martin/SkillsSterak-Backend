import mongoose, { Model } from "mongoose";
import { IPremiumChatRepository } from "../interfaces/repositories/IPremiumChat.repository";
import { IPremiumChat } from "../models/PremiumChat.model";
import BaseRepository from "./Base.repository";

class PremiumChatRepository
  extends BaseRepository<IPremiumChat>
  implements IPremiumChatRepository
{
  constructor(private PremiumChat: Model<IPremiumChat>) {
    super(PremiumChat);
  }

  public async checkUserHadChat(
    userId: string,
    trainerId: string
  ): Promise<boolean> {
    const result = await this.PremiumChat.findOne({
      userId: userId,
      "chats.userId": trainerId,
    });

    return !!result;
  }

  public async getTrainerChats(
    trainerId: string
  ): Promise<Array<IPremiumChat>> {
    return await this.PremiumChat.aggregate([
      {
        $match: {
          trainerId: new mongoose.Types.ObjectId(trainerId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 0,
                username: 1,
              },
            },
          ],
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "premiummessages",
          localField: "_id",
          foreignField: "chatId",
          pipeline: [
            {
              $sort: { createdAt: -1 },
            },
            {
              $limit: 1,
            },
            {
              $project: {
                message: 1,
                _id: 0,
              },
            },
          ],
          as: "lastMessage",
        },
      },
      {
        $unwind: "$lastMessage",
      },
      {
        $project: {
          userId: 1,
          trainerId: 1,
          name: "$user.username",
          lastMessage: "$lastMessage.message",
        },
      },
    ]);
  }

  public async getUserChats(userId: string): Promise<Array<IPremiumChat>> {
    return await this.PremiumChat.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "trainerId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 0,
                username: 1,
              },
            },
          ],
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "premiummessages",
          localField: "_id",
          foreignField: "chatId",
          pipeline: [
            {
              $sort: { createdAt: -1 },
            },
            {
              $limit: 1,
            },
            {
              $project: {
                message: 1,
                _id: 0,
              },
            },
          ],
          as: "lastMessage",
        },
      },
      {
        $unwind: "$lastMessage",
      },
      {
        $project: {
          userId: 1,
          trainerId: 1,
          name: "$user.username",
          lastMessage: "$lastMessage.message",
        },
      },
    ]);
  }
}

export default PremiumChatRepository;
