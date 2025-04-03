import { Request, Response, NextFunction } from "express";
import { IStreamService } from "../interfaces/services/IStream.service";
import { successResponse } from "../utils/responseCreators";
import { GET_DATA_SUCCESS_MESSAGE } from "../constants/responseMessages";
import { StatusCodes } from "../constants/statusCodes";
import binder from "../utils/binder";
import { paginatedGetDataValidator } from "../validators/index.validator";

class StreamController {
  constructor(private streamService: IStreamService) {
    binder(this);
  }

  // public async trainerStreamToken(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {

  //   try {
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  public async startStream(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description } = req.body;
      const thumbnail = req.file!;
      const hostId = req.userId!;

      const data = await this.streamService.startStream(
        hostId,
        title,
        description,
        thumbnail.path
      );

      console.log(data);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }

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

  public async viewStream(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.params;
      const userId = req.userId!;

      const data = await this.streamService.viewStream(userId, roomId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }

  public async getStreams(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, search } = paginatedGetDataValidator(req.query);

      const data = await this.streamService.getStreams(search, page);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }
}

export default StreamController;
