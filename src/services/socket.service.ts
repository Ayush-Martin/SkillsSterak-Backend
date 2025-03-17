import { ISocketService } from "../interfaces/services/ISocket.service";
import { INotificationRepository } from "../interfaces/repositories/INotification.repository";
import { Socket, Server as SocketServer } from "socket.io";
import { SocketEvents } from "../constants/socketEvents";

class SocketService implements ISocketService {
  constructor(private notificationRepository: INotificationRepository) {}

  public async socketConnectionHandler(
    socket: Socket,
    userId: string
  ): Promise<void> {
    socket.emit("message", "connected to socket ()");

    socket.on(SocketEvents.NOTIFICATION_GET, async () => {
      const notifications =
        await this.notificationRepository.getAllNotifications(userId);
      socket.emit(SocketEvents.NOTIFICATION_GET, notifications);
    });

    socket.on(SocketEvents.NOTIFICATION_MARK_READ, async (notificationId) => {
      await this.notificationRepository.markAsRead(notificationId);
    });
  }
}

export default SocketService;
