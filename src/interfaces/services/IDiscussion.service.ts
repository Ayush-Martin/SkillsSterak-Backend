import { IDiscussion } from "../../models/Discussion.model";
import { IReply } from "../../models/Reply.model";

export interface IDiscussionService {
  createDiscussion(
    content: string,
    userId: string,
    refId: string,
    refType: "lesson" | "liveSession"
  ): Promise<IDiscussion>;

  getDiscussions(
    refId: string,
    refType: "lesson" | "liveSession"
  ): Promise<IDiscussion[]>;

  editDiscussion(
    discussionId: string,
    content: string
  ): Promise<IDiscussion | null>;

  deleteDiscussion(discussionId: string): Promise<void>;

  addReply(
    discussionId: string,
    content: string,
    userId: string
  ): Promise<IReply | null>;

  getReplies(discussionId: string): Promise<IReply[]>;
}
