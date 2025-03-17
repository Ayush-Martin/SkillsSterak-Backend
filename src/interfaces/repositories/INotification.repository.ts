import { INotification } from "../../models/Notification.model";
import { IBaseRepository } from "./IBase.repository";

export interface INotificationRepository
  extends IBaseRepository<INotification> {
  getAllNotifications(userId: string): Promise<INotification[]>;
  markAsRead(notificationId: string): Promise<void>;
  addNotifications(
    userIds: string[],
    message: string
  ): Promise<INotification[]>;
}
