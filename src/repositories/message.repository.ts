import mongoose, { Model } from "mongoose";
import { IMessageRepository } from "../interfaces/repositories/IMessage.repository";
import { IMessage } from "./../models/Message.model";
import BaseRepository from "./Base.repository";

class MessageRepository
  extends BaseRepository<IMessage>
  implements IMessageRepository
{
  constructor(private Message: Model<IMessage>) {
    super(Message);
  }

  public async getChatMessages(chatId: string): Promise<Array<IMessage>> {
    return await this.Message.aggregate([
      {
        $match: {
          chatId: new mongoose.Types.ObjectId(chatId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                profileImage: 1,
                username: 1,
              },
            },
          ],
          as: "sender",
        },
      },
      {
        $unwind: "$sender",
      },
      {
        $project: {
          __v: 0,
          updatedAt: 0,
        },
      },
    ]);
  }
}

export default MessageRepository;
