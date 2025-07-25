import { Model } from "mongoose";
import { IReplyRepository } from "../interfaces/repositories/IReply.repository";
import { IReply } from "../models/Reply.model";
import BaseRepository from "./Base.repository";

class ReplyRepository
  extends BaseRepository<IReply>
  implements IReplyRepository
{
  constructor(private _Reply: Model<IReply>) {
    super(_Reply);
  }

  public async getReplies(reviewId: string): Promise<Array<IReply>> {
    return await this._Reply
      .find({ entityId: reviewId })
      .populate({
        path: "userId",
        select: "username profileImage",
      })
      .select("courseId rating content");
  }

  public async deleteByEntityId(entityId: string): Promise<void> {
    await this._Reply.deleteMany({ entityId });
  }
}

export default ReplyRepository;
