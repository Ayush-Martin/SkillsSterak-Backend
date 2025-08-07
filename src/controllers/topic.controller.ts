import { Request, Response, NextFunction } from "express";
import binder from "../utils/binder";
import { ITopicService } from "../interfaces/services/ITopic.service";
import { addTopicValidator } from "../validators/topic.validator";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { GeneralMessage, TopicMessage } from "../constants/responseMessages";
import { paginatedGetDataValidator } from "../validators/pagination.validator";

class TopicController {
  constructor(private _topicService: ITopicService) {
    binder(this);
  }

  public async addTopic(req: Request, res: Response, next: NextFunction) {
    try {
      const { title } = addTopicValidator(req.body);

      const data = await this._topicService.addTopic(title);

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(TopicMessage.TopicAdded, data));
    } catch (err) {
      next(err);
    }
  }

  public async editTopic(req: Request, res: Response, next: NextFunction) {
    try {
      const { topicId } = req.params;
      const { title } = addTopicValidator(req.body);

      const data = await this._topicService.editTopicName(topicId, title);

      res
        .status(StatusCodes.OK)
        .json(successResponse(TopicMessage.TopicUpdated, data));
    } catch (err) {
      next(err);
    }
  }

  public async getAllTopics(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this._topicService.getAllTopics();

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  public async getTopics(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, search, size } = paginatedGetDataValidator(req.query);

      const data = await this._topicService.getTopics(search, page, size);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }
}

export default TopicController;
