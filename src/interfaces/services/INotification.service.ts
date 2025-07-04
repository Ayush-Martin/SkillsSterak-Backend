export interface INotificationService {
  /**
   * Delivers all pending notifications to a user. Used to keep users informed about relevant events and updates.
   */
  sendUserNotifications(userId: string): Promise<void>;

  /**
   * Marks a notification as read for a user. Used to manage notification state and improve user experience.
   */
  markAsRead(notificationId: string): Promise<void>;

  /**
   * Notifies a trainer when a new course is successfully added. Used to confirm course creation and encourage engagement.
   */
  sendCourseAddedNotification(
    trainerId: string,
    courseName: string
  ): Promise<void>;

  /**
   * Notifies relevant users when a course is approved. Used to inform trainers and possibly students about course availability.
   */
  sendCourseApprovedNotification(courseId: string): Promise<void>;

  /**
   * Notifies a trainer when their course is rejected. Used to provide feedback and prompt necessary changes.
   */
  sendCourseRejectedNotification(courseId: string): Promise<void>;

  /**
   * Notifies admins or relevant parties when a user requests to become a trainer. Used to trigger review workflows.
   */
  sendTrainerRequestNotification(userId: string): Promise<void>;

  /**
   * Notifies a user when their trainer request is approved. Used to onboard new trainers and encourage platform contribution.
   */
  sendApproveTrainerRequestNotification(userId: string): Promise<void>;

  /**
   * Notifies a user when their trainer request is rejected. Used to provide feedback and maintain transparency.
   */
  sendRejectTrainerRequestNotification(userId: string): Promise<void>;
}
