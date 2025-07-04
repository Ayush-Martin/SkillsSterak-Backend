import { IMessageService } from "./../interfaces/services/IMessage.service";
import { ISocketService } from "../interfaces/services/ISocket.service";
import { Socket } from "socket.io";
import { SocketEvents } from "../constants/socketEvents";
import { INotificationService } from "../interfaces/services/INotification.service";
import { IStreamService } from "../interfaces/services/IStream.service";
import { IChatService } from "../interfaces/services/IChat.service";
import { messageReactions } from "../types/messageTypes";

class SocketService implements ISocketService {
  constructor(
    private notificationService: INotificationService,
    private streamService: IStreamService,
    private chatService: IChatService
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
      SocketEvents.LIVE_CHAT_NEW_MESSAGE,
      async ({ roomId, message }: { roomId: string; message: string }) => {
        console.log("live chat", roomId, message);
        await this.streamService.liveChat(roomId, userId, message);
      }
    );

    socket.on(
      SocketEvents.CHAT_MESSAGE_SEND,
      async ({ chatId, message }: { chatId: string; message: string }) => {
        await this.chatService.addNewMessage(userId, chatId, message, "text");
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
        await this.chatService.reactMessage(userId, messageId, chatId, emoji);
      }
    );

    // socket.on(
    //   "new message",
    //   async ({
    //     message,
    //     receiverId,
    //     chatId,
    //   }: {
    //     message: string;
    //     receiverId: string;
    //     chatId: string | null;
    //   }) => {
    //     await this.premiumChatService.addMessage(
    //       message,
    //       userId,
    //       receiverId,
    //       chatId
    //     );
    //   }
    // );
  }
}

export default SocketService;
