import { ITopic } from "../../models/Topic.model";
import { IBaseRepository } from "./IBase.repository";

export interface ITopicRepository extends IBaseRepository<ITopic> {
  getTopics(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<ITopic>>;
  getTopicsCount(search: RegExp): Promise<number>;
  getTopicByName(topicName: string): Promise<ITopic | null>;
}
