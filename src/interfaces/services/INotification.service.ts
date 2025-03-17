interface INotificationService {
  sendNotifications(userId: string): Promise<void>;

  sendCourseAddedNotification(
    trainerId: string,
    courseName: string
  ): Promise<void>;
}
