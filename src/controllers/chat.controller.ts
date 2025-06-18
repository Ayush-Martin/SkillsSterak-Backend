import { Request, Response, NextFunction } from "express";
import { IChatService } from "../interfaces/services/IChat.service";
import binder from "../utils/binder";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { GET_DATA_SUCCESS_MESSAGE } from "../constants/responseMessages";

/** Chat controller: manages chat and messaging operations */
class ChatController {
  /** Injects chat service */
  constructor(private chatService: IChatService) {
    binder(this);
  }

  /** Get all chats for user */
  public async getChats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;

      const chats = await this.chatService.getChats(userId!);

      res.status(StatusCodes.OK).json(successResponse("chats", chats));
    } catch (err) {
      next(err);
    }
  }

  /** Get messages for a chat */
  public async getChatMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { chatId } = req.params;

      const messages = await this.chatService.getMessages(chatId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, messages));
    } catch (err) {
      next(err);
    }
  }

  /** Send media message in chat */
  public async sendMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const userId = req.userId!;

      const file = req.file!;

      await this.chatService.addNewMessage(
        userId,
        chatId,
        file.path,
        file.mimetype.startsWith("image/") ? "image" : "text"
      );

      res.status(StatusCodes.CREATED).json(successResponse("media sent"));
    } catch (err) {
      next(err);
    }
  }

  /** Create or get individual chat */
  public async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { trainerId } = req.params;
      const userId = req.userId!;

      const chat = await this.chatService.createIndividualChat(
        userId,
        trainerId
      );

      console.log(chat);

      res
        .status(StatusCodes.ACCEPTED)
        .json(successResponse("new chat created", chat));
    } catch (err) {
      next(err);
    }
  }
}

export default ChatController;
