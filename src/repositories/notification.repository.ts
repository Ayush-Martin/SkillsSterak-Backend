import { Model } from "mongoose";
import { INotificationRepository } from "../interfaces/repositories/INotification.repository";
import { INotification } from "../models/Notification.model";
import BaseRepository from "./Base.repository";
import { getObjectId } from "../utils/objectId";

class NotificationRepository
  extends BaseRepository<INotification>
  implements INotificationRepository
{
  constructor(private Notification: Model<INotification>) {
    super(Notification);
  }

  public async getAllNotifications(userId: string): Promise<INotification[]> {
    return await this.Notification.find(
      { userId, read: false },
      { message: 1 }
    ).sort({ createdAt: -1 });
  }

  public async markAsRead(notificationId: string): Promise<void> {
    await this.Notification.findByIdAndUpdate(notificationId, { read: true });
  }

  public async addNotifications(
    userIds: string[],
    message: string
  ): Promise<INotification[]> {
    const notifications = userIds.map((userId) => ({
      userId: getObjectId(userId),
      message,
    }));

    return await this.Notification.insertMany(notifications);
  }

  public async addNotification(
    userId: string,
    message: string
  ): Promise<INotification> {
    const notification = new this.Notification({ userId, message });

    return await notification.save();
  }
}

export default NotificationRepository;
