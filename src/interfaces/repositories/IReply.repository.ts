import { IReply } from "../../models/Reply.model";
import BaseRepository from "../../repositories/Base.repository";

export interface IReplyRepository extends BaseRepository<IReply> {
  getReviewReplies(reviewId: string): Promise<Array<IReply | null>>;
  deleteByEntityId(entityId: string): Promise<void>;
}
