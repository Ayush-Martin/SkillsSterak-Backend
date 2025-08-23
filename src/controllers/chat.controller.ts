import { Request, Response, NextFunction } from "express";
import { IChatService } from "../interfaces/services/IChat.service";
import binder from "../utils/binder";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { ChatMessage, GeneralMessage } from "../constants/responseMessages";

class ChatController {
  constructor(private _chatService: IChatService) {
    binder(this);
  }

  public async getChats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      const chats = await this._chatService.getChats(userId!);
      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, chats));
    } catch (err) {
      next(err);
    }
  }

  public async getChatMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { chatId } = req.params;

      const messages = await this._chatService.getMessages(chatId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, messages));
    } catch (err) {
      next(err);
    }
  }

  public async sendMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const userId = req.userId!;

      const file = req.file!;

      await this._chatService.addNewMessage(
        userId,
        chatId,
        file.path,
        file.mimetype.startsWith("image/") ? "image" : "text"
      );

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(ChatMessage.MediaSent));
    } catch (err) {
      next(err);
    }
  }

  public async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { trainerId } = req.params;
      const userId = req.userId!;

      const chat = await this._chatService.createIndividualChat(
        userId,
        trainerId
      );

      console.log(chat);

      res
        .status(StatusCodes.ACCEPTED)
        .json(successResponse(ChatMessage.NewChat, chat));
    } catch (err) {
      next(err);
    }
  }

  public async getChatMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;

      const members = await this._chatService.getChatMembers(chatId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, members));
    } catch (err) {
      next(err);
    }
  }
}

export default ChatController;
