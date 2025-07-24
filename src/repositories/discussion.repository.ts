import { Model } from "mongoose";
import { IDiscussionRepository } from "../interfaces/repositories/IDiscussion.repository";
import { IDiscussion } from "../models/Discussion.model";
import BaseRepository from "./Base.repository";

class DiscussionRepository
  extends BaseRepository<IDiscussion>
  implements IDiscussionRepository
{
  constructor(private _Discussion: Model<IDiscussion>) {
    super(_Discussion);
  }

  public async editDiscussion(
    discussionId: string,
    content: string
  ): Promise<IDiscussion | null> {
    return await this._Discussion.findByIdAndUpdate(
      discussionId,
      { content },
      { new: true }
    );
  }

  public async getDiscussions(
    refId: string,
    refType: "lesson" | "liveSession"
  ): Promise<IDiscussion[]> {
    return await this._Discussion.find({ refId, refType }).populate({
      path: "userId",
      select: "username profileImage",
    });
  }
}

export default DiscussionRepository;
