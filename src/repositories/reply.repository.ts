import { Model } from "mongoose";
import { IReplyRepository } from "../interfaces/repositories/IReply.repository";
import { IReply } from "../models/Reply.model";
import BaseRepository from "./Base.repository";

class ReplyRepository
  extends BaseRepository<IReply>
  implements IReplyRepository
{
  constructor(private Reply: Model<IReply>) {
    super(Reply);
  }

  public async getReplies(reviewId: string): Promise<Array<IReply>> {
    return await this.Reply.find({ entityId: reviewId })
      .populate({
        path: "userId",
        select: "username profileImage",
      })
      .select("courseId rating content");
  }

  public async deleteByEntityId(entityId: string): Promise<void> {
    await this.Reply.deleteMany({ entityId });
  }
}

export default ReplyRepository;
