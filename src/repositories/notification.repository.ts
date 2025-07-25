import { Model } from "mongoose";
import { INotificationRepository } from "../interfaces/repositories/INotification.repository";
import { INotification } from "../models/Notification.model";
import BaseRepository from "./Base.repository";
import { getObjectId } from "../utils/objectId";

class NotificationRepository
  extends BaseRepository<INotification>
  implements INotificationRepository
{
  constructor(private _Notification: Model<INotification>) {
    super(_Notification);
  }

  public async getAllNotifications(userId: string): Promise<INotification[]> {
    return await this._Notification.find(
      { userId, read: false },
      { message: 1 }
    ).sort({ createdAt: -1 });
  }

  public async markAsRead(notificationId: string): Promise<void> {
    await this._Notification.findByIdAndUpdate(notificationId, { read: true });
  }

  public async addNotifications(
    userIds: string[],
    message: string
  ): Promise<INotification[]> {
    const notifications = userIds.map((userId) => ({
      userId: getObjectId(userId),
      message,
    }));

    return await this._Notification.insertMany(notifications);
  }

  public async addNotification(
    userId: string,
    message: string
  ): Promise<INotification> {
    const notification = new this._Notification({ userId, message });

    return await notification.save();
  }
}

export default NotificationRepository;
