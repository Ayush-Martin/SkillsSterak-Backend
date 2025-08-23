import { ISocketService } from "../interfaces/services/ISocket.service";
import { Socket } from "socket.io";
import { SocketEvents } from "../constants/socketEvents";
import { INotificationService } from "../interfaces/services/INotification.service";
import { IChatService } from "../interfaces/services/IChat.service";
import { messageReactions } from "../types/messageTypes";
import { ILiveSessionService } from "../interfaces/services/ILiveSession.service";

class SocketService implements ISocketService {
  constructor(
    private _notificationService: INotificationService,
    private _chatService: IChatService,
    private _liveSessionService: ILiveSessionService
  ) {}

  public async socketConnectionHandler(
    socket: Socket,
    userId: string
  ): Promise<void> {
    socket.emit("message", "connected to socket ()");

    // Join the user to their private room
    socket.join(userId);

    socket.on(SocketEvents.NOTIFICATION_GET, async () => {
      await this._notificationService.sendUserNotifications(userId);
    });

    socket.on(SocketEvents.NOTIFICATION_MARK_READ, async (notificationId) => {
      await this._notificationService.markAsRead(notificationId);
    });

    socket.on(
      SocketEvents.LIVE_CHAT_MESSAGE_SEND,
      async ({
        liveSessionId,
        message,
      }: {
        liveSessionId: string;
        message: string;
      }) => {
        await this._liveSessionService.liveChat(liveSessionId, userId, message);
      }
    );

    socket.on(
      SocketEvents.CHAT_MESSAGE_SEND,
      async ({
        chatId,
        message,
        type,
      }: {
        chatId: string;
        message: string;
        type?: "text" | "emoji";
      }) => {
        await this._chatService.addNewMessage(
          userId,
          chatId,
          message,
          type || "text"
        );
      }
    );

    socket.on(
      SocketEvents.CHAT_MESSAGE_REACTION_SEND,
      async ({
        messageId,
        chatId,
        emoji,
      }: {
        messageId: string;
        chatId: string;
        emoji: messageReactions;
      }) => {
        await this._chatService.reactMessage(userId, messageId, chatId, emoji);
      }
    );
  }
}

export default SocketService;
