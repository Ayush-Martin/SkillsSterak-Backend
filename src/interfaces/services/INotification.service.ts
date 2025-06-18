export interface INotificationService {
  /** Sends notifications to a user. */
  sendUserNotifications(userId: string): Promise<void>;
  /** Marks a notification as read. */
  markAsRead(notificationId: string): Promise<void>;
  /** Sends a notification when a course is added by a trainer. */
  sendCourseAddedNotification(
    trainerId: string,
    courseName: string
  ): Promise<void>;
  /** Sends a notification when a course is approved. */
  sendCourseApprovedNotification(courseId: string): Promise<void>;
  /** Sends a notification when a course is rejected. */
  sendCourseRejectedNotification(courseId: string): Promise<void>;
  /** Sends a notification for a trainer request. */
  sendTrainerRequestNotification(userId: string): Promise<void>;
  /** Sends a notification when a trainer request is approved. */
  sendApproveTrainerRequestNotification(userId: string): Promise<void>;
  /** Sends a notification when a trainer request is rejected. */
  sendRejectTrainerRequestNotification(userId: string): Promise<void>;
}
