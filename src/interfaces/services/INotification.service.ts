export interface INotificationService {
  sendUserNotifications(userId: string): Promise<void>;
  markAsRead(notificationId: string): Promise<void>;
  sendCourseAddedNotification(
    trainerId: string,
    courseName: string
  ): Promise<void>;
  sendCourseApprovedNotification(courseId: string): Promise<void>;
  sendCourseRejectedNotification(courseId: string): Promise<void>;
  sendTrainerRequestNotification(userId: string): Promise<void>;
  sendApproveTrainerRequestNotification(userId: string): Promise<void>;
  sendRejectTrainerRequestNotification(userId: string): Promise<void>;
}
