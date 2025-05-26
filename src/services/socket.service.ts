import { ISocketService } from "../interfaces/services/ISocket.service";
import { Socket } from "socket.io";
import { SocketEvents } from "../constants/socketEvents";
import { INotificationService } from "../interfaces/services/INotification.service";
import { IPremiumChatService } from "../interfaces/services/IPremiumChat.service";
import { IStreamService } from "../interfaces/services/IStream.service";

class SocketService implements ISocketService {
  constructor(
    private notificationService: INotificationService,
    private premiumChatService: IPremiumChatService,
    private streamService: IStreamService
  ) {}

  public async socketConnectionHandler(
    socket: Socket,
    userId: string
  ): Promise<void> {
    socket.emit("message", "connected to socket ()");
    socket.join(userId);

    socket.on(SocketEvents.NOTIFICATION_GET, async () => {
      await this.notificationService.sendUserNotifications(userId);
    });

    socket.on(SocketEvents.NOTIFICATION_MARK_READ, async (notificationId) => {
      await this.notificationService.markAsRead(notificationId);
    });

    socket.on(
      "liveChat",
      async ({ roomId, message }: { roomId: string; message: string }) => {
        console.log("live chat", roomId, message);
        await this.streamService.liveChat(roomId, userId, message);
      }
    );

    socket.on(
      "new message",
      async ({
        message,
        receiverId,
        chatId,
      }: {
        message: string;
        receiverId: string;
        chatId: string | null;
      }) => {
        await this.premiumChatService.addMessage(
          message,
          userId,
          receiverId,
          chatId
        );
      }
    );
  }
}

export default SocketService;
