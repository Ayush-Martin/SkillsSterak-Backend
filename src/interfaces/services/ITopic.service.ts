import { ITopic } from "../../models/Topic.model";

export interface ITopicService {
  getAllTopics(): Promise<ITopic[]>;
  getTopics(
    search: string,
    page: number,
    size: number
  ): Promise<{
    topics: Array<ITopic>;
    currentPage: number;
    totalPages: number;
  }>;
  editTopicName(topicId: string, topicName: string): Promise<ITopic | null>;
  addTopic(topicName: string): Promise<ITopic>;
}
