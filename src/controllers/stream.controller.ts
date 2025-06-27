import { Request, Response, NextFunction } from "express";
import { IStreamService } from "../interfaces/services/IStream.service";
import { successResponse } from "../utils/responseCreators";
import { GET_DATA_SUCCESS_MESSAGE } from "../constants/responseMessages";
import { StatusCodes } from "../constants/statusCodes";
import binder from "../utils/binder";
import { paginatedGetDataValidator } from "../validators/pagination.validator";

/** Stream controller: manages live stream operations */
class StreamController {
  /** Injects stream service */
  constructor(private streamService: IStreamService) {
    binder(this);
  }

  /** Start a new live stream */
  public async startStream(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description } = req.body;
      const { courseId } = req.params;
      const thumbnail = req.file!;
      const hostId = req.userId!;

      // console.log(thumbnail, thumbnail.path);

      const data = await this.streamService.startStream(
        hostId,
        title,
        description,
        thumbnail.path,
        courseId
      );

      console.log("stream dfdfdfdf");
      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }

  /** End a live stream */
  public async endStream(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.params;

      await this.streamService.endStream(roomId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE));
    } catch (err) {
      next(err);
    }
  }

  /** View a live stream */
  public async viewStream(req: Request, res: Response, next: NextFunction) {
    try {
      const { streamId } = req.params;
      const userId = req.userId!;

      const data = await this.streamService.viewStream(userId, streamId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }

  /** Get all streams for a course */
  public async getStreams(req: Request, res: Response, next: NextFunction) {
    try {
      // const { page, search, size } = paginatedGetDataValidator(req.query);
      const { courseId } = req.params;

      const data = await this.streamService.getStreams(courseId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }
}

export default StreamController;
