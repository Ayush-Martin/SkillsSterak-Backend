import { Request, Response, NextFunction } from "express";
import { IPremiumChatService } from "../interfaces/services/IPremiumChat.service";
import binder from "../utils/binder";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { GET_DATA_SUCCESS_MESSAGE } from "../constants/responseMessages";
import { sendMediaValidator } from "../validators/chat.validator";

class ChatController {
  constructor(private premiumChatService: IPremiumChatService) {
    binder(this);
  }

  public async getTrainerChats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const trainerId = req.userId!;

      const chats = await this.premiumChatService.getTrainerChats(trainerId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, chats));
    } catch (err) {
      next(err);
    }
  }

  public async getUserChats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;

      const chats = await this.premiumChatService.getUserChats(userId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, chats));
    } catch (err) {
      next(err);
    }
  }

  public async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;

      const messages = await this.premiumChatService.getMessages(chatId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, messages));
    } catch (err) {
      next(err);
    }
  }

  public async sendMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.query as { chatId: string | null };
      const userId = req.userId!;
      const { receiverId } = sendMediaValidator(req.body);
      const file = req.file!;

      await this.premiumChatService.addMessage(
        file.path,
        userId,
        receiverId,
        chatId,
        file.mimetype.startsWith("image/") ? "image" : "text"
      );

      res.status(StatusCodes.OK).json(successResponse("Media sent"));
    } catch (err) {
      next(err);
    }
  }
}

export default ChatController;
