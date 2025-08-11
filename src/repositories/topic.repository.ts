import { Model } from "mongoose";
import { ITopicRepository } from "../interfaces/repositories/ITopic.repository";
import { ITopic } from "../models/Topic.model";
import BaseRepository from "./Base.repository";

class TopicRepository
  extends BaseRepository<ITopic>
  implements ITopicRepository
{
  constructor(private _Topic: Model<ITopic>) {
    super(_Topic);
  }

  public async getTopics(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<Array<ITopic>> {
    return await this._Topic.find({ topicName: search }).skip(skip).limit(limit);
  }

  public async getTopicsCount(search: RegExp): Promise<number> {
    return await this._Topic.countDocuments({ topicName: search });
  }

  public async getTopicByName(topicName: string): Promise<ITopic | null> {
    return await this._Topic.findOne({ topicName: topicName });
  }
}

export default TopicRepository;
