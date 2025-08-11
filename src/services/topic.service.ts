import { TopicMessage } from "../constants/responseMessages";
import { StatusCodes } from "../constants/statusCodes";
import { ITopicRepository } from "../interfaces/repositories/ITopic.repository";
import { ITopicService } from "../interfaces/services/ITopic.service";
import { ITopic } from "../models/Topic.model";
import errorCreator from "../utils/customError";

class TopicService implements ITopicService {
  constructor(private _topicRepository: ITopicRepository) {}

  public async editTopicName(
    topicId: string,
    topicName: string
  ): Promise<ITopic | null> {
    const topicExist = await this._topicRepository.getTopicByName(topicName);

    if (topicExist && topicExist.id != topicId) {
      errorCreator(TopicMessage.TopicExists, StatusCodes.CONFLICT);
    }

    return await this._topicRepository.updateById(topicId, {
      topicName: topicName,
    });
  }

  public async getAllTopics(): Promise<ITopic[]> {
    return await this._topicRepository.findAll();
  }

  public async getTopics(
    search: string,
    page: number,
    size: number
  ): Promise<{
    topics: Array<ITopic>;
    currentPage: number;
    totalPages: number;
  }> {
    const searchRegex = new RegExp(search, "i");
    const skip = (page - 1) * size;
    const topics = await this._topicRepository.getTopics(
      searchRegex,
      skip,
      size
    );

    const totalTopics = await this._topicRepository.getTopicsCount(searchRegex);
    const totalPages = Math.ceil(totalTopics / size);
    return {
      topics,
      currentPage: page,
      totalPages,
    };
  }

  public async addTopic(topicName: string): Promise<ITopic> {
    const topicExist = await this._topicRepository.getTopicByName(topicName);

    if (topicExist) {
      errorCreator(TopicMessage.TopicExists, StatusCodes.CONFLICT);
    }

    return await this._topicRepository.create({ topicName: topicName });
  }
}

export default TopicService;
