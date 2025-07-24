import { Request, Response, NextFunction } from "express";
import { ILiveSessionService } from "../interfaces/services/ILiveSession.service";
import binder from "../utils/binder";
import { ScheduleLiveSessionValidator } from "../validators/liveSession.validator";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import {
  GeneralMessage,
  LiveSessionMessage,
} from "../constants/responseMessages";

class LiveSessionController {
  constructor(private _liveSessionService: ILiveSessionService) {
    binder(this);
  }

  public async scheduleLiveSession(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const { date, description, time, title } = ScheduleLiveSessionValidator(
        req.body
      );

      const data = await this._liveSessionService.scheduleLiveSession(
        courseId,
        title,
        description,
        date,
        time
      );

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(LiveSessionMessage.LiveSessionScheduled, data));
    } catch (err) {
      next(err);
    }
  }

  public async getLiveSessions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;

      const data = await this._liveSessionService.getLiveSessionsByCourseId(
        courseId
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  public async editLiveSession(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { liveSessionId } = req.params;
      const { date, description, time, title } = ScheduleLiveSessionValidator(
        req.body
      );

      const data = await this._liveSessionService.editLiveSession(
        liveSessionId,
        {
          date,
          description,
          time,
          title,
        }
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(LiveSessionMessage.LiveSessionUpdated, data));
    } catch (err) {
      next(err);
    }
  }

  public async deleteLiveSession(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { liveSessionId } = req.params;

      await this._liveSessionService.deleteLiveSession(liveSessionId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(LiveSessionMessage.LiveSessionDeleted));
    } catch (err) {
      next(err);
    }
  }

  public async trainerViewStartLiveSession(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { liveSessionId } = req.params;

      const data = await this._liveSessionService.trainerViewStartLiveSession(
        liveSessionId
      );

      res
        .status(StatusCodes.OK)
        .json(
          successResponse(
            data?.token
              ? LiveSessionMessage.LiveSessionStarted
              : GeneralMessage.DataReturned,
            data
          )
        );
    } catch (err) {
      next(err);
    }
  }
}

export default LiveSessionController;
