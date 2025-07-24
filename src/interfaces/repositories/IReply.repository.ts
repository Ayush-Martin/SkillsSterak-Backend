import { IReply } from "../../models/Reply.model";
import BaseRepository from "../../repositories/Base.repository";

/**
 * Repository interface for reply-related data operations.
 * Supports threaded discussions and moderation features for reviews.
 */
export interface IReplyRepository extends BaseRepository<IReply> {
  /**
   * Retrieves all replies associated with a specific review.
   * Enables nested conversations and review engagement.
   */
  getReplies(reviewId: string): Promise<Array<IReply>>;

  /**
   * Deletes all replies associated with a given entity (e.g., review or comment).
   * Supports moderation, cleanup, and cascading deletions.
   */
  deleteByEntityId(entityId: string): Promise<void>;
}
