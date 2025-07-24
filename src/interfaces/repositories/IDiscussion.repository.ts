import { IDiscussion } from "../../models/Discussion.model";
import { IBaseRepository } from "./IBase.repository";

export interface IDiscussionRepository extends IBaseRepository<IDiscussion> {
  editDiscussion(
    discussionId: string,
    content: string
  ): Promise<IDiscussion | null>;

  getDiscussions(
    refId: string,
    refType: "lesson" | "liveSession"
  ): Promise<IDiscussion[]>;
}
