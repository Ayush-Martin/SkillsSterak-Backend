import mongoose, { Model } from "mongoose";
import { IMessageRepository } from "../interfaces/repositories/IMessage.repository";
import { IMessage } from "./../models/Message.model";
import BaseRepository from "./Base.repository";
import { messageReactions } from "../types/messageTypes";

class MessageRepository
  extends BaseRepository<IMessage>
  implements IMessageRepository
{
  constructor(private _Message: Model<IMessage>) {
    super(_Message);
  }

  public async getChatMessages(chatId: string): Promise<Array<IMessage>> {
    return await this._Message.aggregate([
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

  public async reactMessage(
    userId: string,
    messageId: string,
    emoji: messageReactions
  ): Promise<IMessage | null> {
    await this._Message.updateOne(
      { _id: messageId },
      { $pull: { reactions: { userId } } }
    );

    await this._Message.updateOne(
      { _id: messageId },
      {
        $push: {
          reactions: {
            userId,
            emoji,
          },
        },
      }
    );

    const updatedMessage = await this._Message.findById(messageId);

    return updatedMessage;
  }
}

export default MessageRepository;
