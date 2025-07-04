import { Request, Response, NextFunction } from "express";
import { IStreamService } from "../interfaces/services/IStream.service";
import { successResponse } from "../utils/responseCreators";
import { StatusCodes } from "../constants/statusCodes";
import binder from "../utils/binder";
import { GeneralMessage } from "../constants/responseMessages";

/**
 * Handles live stream operations for courses, including start, end, view, and retrieval.
 * All methods are bound for safe Express routing.
 */
class StreamController {
  constructor(private streamService: IStreamService) {
    // Ensures 'this' context is preserved for all methods
    binder(this);
  }

  /**
   * Starts a new live stream for a course, requiring a thumbnail and host.
   */
  public async startStream(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description } = req.body;
      const { courseId } = req.params;
      const thumbnail = req.file!;
      const hostId = req.userId!;

      const data = await this.streamService.startStream(
        hostId,
        title,
        description,
        thumbnail.path,
        courseId
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Ends a live stream by room ID, supporting stream lifecycle management.
   */
  public async endStream(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.params;

      await this.streamService.endStream(roomId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Allows a user to view a live stream, returning stream data and access token.
   */
  public async viewStream(req: Request, res: Response, next: NextFunction) {
    try {
      const { streamId } = req.params;
      const userId = req.userId!;

      const data = await this.streamService.viewStream(userId, streamId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves all streams for a course, enabling stream listings and history.
   */
  public async getStreams(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;

      const data = await this.streamService.getStreams(courseId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }
}

export default StreamController;
