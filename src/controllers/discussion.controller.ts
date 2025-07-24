import { Request, Response, NextFunction } from "express";
import {
  addDiscussionValidator,
  addReplyValidator,
  getDiscussionValidator,
} from "../validators/discussion.validator";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import binder from "../utils/binder";
import {
  DiscussionMessage,
  GeneralMessage,
} from "../constants/responseMessages";
import { IDiscussionService } from "../interfaces/services/IDiscussion.service";

class DiscussionController {
  constructor(private _DiscussionService: IDiscussionService) {
    binder(this);
  }

  public async createDiscussion(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const { content, refId, refType } = addDiscussionValidator(req.body);

      const data = await this._DiscussionService.createDiscussion(
        content,
        userId,
        refId,
        refType
      );
      res
        .status(StatusCodes.CREATED)
        .json(successResponse(DiscussionMessage.DiscussionAdded, data));
    } catch (err) {
      next(err);
    }
  }

  public async getDiscussions(req: Request, res: Response, next: NextFunction) {
    try {
      const { refType, refId } = getDiscussionValidator(req.query);

      const data = await this._DiscussionService.getDiscussions(refId, refType);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  public async editDiscussion(req: Request, res: Response, next: NextFunction) {
    try {
      const { discussionId } = req.params;
      const { content } = req.body;
      const data = await this._DiscussionService.editDiscussion(
        discussionId,
        content
      );
      res
        .status(StatusCodes.OK)
        .json(successResponse(DiscussionMessage.DiscussionUpdated, data));
    } catch (err) {
      next(err);
    }
  }

  public async deleteDiscussion(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { discussionId } = req.params;
      const data = await this._DiscussionService.deleteDiscussion(discussionId);
      res
        .status(StatusCodes.OK)
        .json(successResponse(DiscussionMessage.DiscussionDeleted, data));
    } catch (err) {
      next(err);
    }
  }

  public async addReply(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { discussionId } = req.params;
      const { content } = addReplyValidator(req.body);
      const data = await this._DiscussionService.addReply(
        discussionId,
        content,
        userId
      );
      res
        .status(StatusCodes.OK)
        .json(successResponse(DiscussionMessage.ReplyAdded, data));
    } catch (err) {
      next(err);
    }
  }

  public async getReplies(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { discussionId } = req.params;

      const data = await this._DiscussionService.getReplies(discussionId);
      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }
}

export default DiscussionController;
