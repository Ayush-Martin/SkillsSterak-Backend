import { INotification } from "../../models/Notification.model";
import { IBaseRepository } from "./IBase.repository";

/**
 * Repository interface for notification-related data operations.
 * Supports user engagement, alerting, and notification management features.
 */
export interface INotificationRepository
  extends IBaseRepository<INotification> {
  /**
   * Retrieves all notifications for a specific user.
   * Enables notification center and alert displays in the UI.
   */
  getAllNotifications(userId: string): Promise<INotification[]>;

  /**
   * Marks a notification as read by its unique identifier.
   * Supports notification state management and user acknowledgment.
   */
  markAsRead(notificationId: string): Promise<void>;

  /**
   * Adds notifications for multiple users at once.
   * Useful for broadcasting announcements or system-wide alerts.
   */
  addNotifications(
    userIds: string[],
    message: string
  ): Promise<INotification[]>;

  /**
   * Adds a notification for a single user.
   * Supports targeted messaging and personalized alerts.
   */
  addNotification(userId: string, message: string): Promise<INotification>;
}
