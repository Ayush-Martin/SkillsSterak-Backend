import { IDiscussionRepository } from "../interfaces/repositories/IDiscussion.repository";
import { IReplyRepository } from "../interfaces/repositories/IReply.repository";
import { IDiscussionService } from "../interfaces/services/IDiscussion.service";
import { IDiscussion } from "../models/Discussion.model";
import { IReply } from "../models/Reply.model";
import { getObjectId } from "../utils/objectId";

class DiscussionService implements IDiscussionService {
  constructor(
    private _discussionRepository: IDiscussionRepository,
    private _replyRepository: IReplyRepository
  ) {}

  public async createDiscussion(
    content: string,
    userId: string,
    refId: string,
    refType: "lesson" | "liveSession"
  ): Promise<IDiscussion> {
    return await this._discussionRepository.create({
      content,
      userId: getObjectId(userId),
      refId: getObjectId(refId),
      refType,
    });
  }

  public async deleteDiscussion(discussionId: string): Promise<void> {
    return await this._discussionRepository.deleteById(discussionId);
  }

  public async editDiscussion(
    discussionId: string,
    content: string
  ): Promise<IDiscussion | null> {
    return await this._discussionRepository.editDiscussion(
      discussionId,
      content
    );
  }

  public async getDiscussions(
    refId: string,
    refType: "lesson" | "liveSession"
  ): Promise<IDiscussion[]> {
    return await this._discussionRepository.getDiscussions(refId, refType);
  }

  addReply(
    discussionId: string,
    content: string,
    userId: string
  ): Promise<IReply | null> {
    return this._replyRepository.create({
      userId: getObjectId(userId),
      entityId: getObjectId(discussionId),
      content,
    });
  }

  public async getReplies(discussionId: string): Promise<IReply[]> {
    return await this._replyRepository.getReplies(discussionId);
  }
}

export default DiscussionService;
