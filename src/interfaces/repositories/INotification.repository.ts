import { INotification } from "../../models/Notification.model";
import { IBaseRepository } from "./IBase.repository";

export interface INotificationRepository
  extends IBaseRepository<INotification> {
  /** Get all notifications for a user */
  getAllNotifications(userId: string): Promise<INotification[]>;
  /** Mark a notification as read by its ID */
  markAsRead(notificationId: string): Promise<void>;
  /** Add notifications for multiple users */
  addNotifications(
    userIds: string[],
    message: string
  ): Promise<INotification[]>;
  /** Add a notification for a single user */
  addNotification(userId: string, message: string): Promise<INotification>;
}
