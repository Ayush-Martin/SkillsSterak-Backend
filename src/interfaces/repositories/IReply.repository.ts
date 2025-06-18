import { IReply } from "../../models/Reply.model";
import BaseRepository from "../../repositories/Base.repository";

export interface IReplyRepository extends BaseRepository<IReply> {
  /** Retrieves replies for a specific review */
  getReviewReplies(reviewId: string): Promise<Array<IReply | null>>;
  /** Deletes replies by entity ID */
  deleteByEntityId(entityId: string): Promise<void>;
}
