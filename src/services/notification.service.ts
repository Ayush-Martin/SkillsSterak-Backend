import { INotificationRepository } from "../interfaces/repositories/INotification.repository";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { ITrainerRepository } from "../interfaces/repositories/ITrainer.repository";
import { SocketEvents } from "../constants/socketEvents";
import { io } from "..";
import { read } from "fs";

class NotificationService implements INotificationService {
  constructor(
    private notificationRepository: INotificationRepository,
    private userRepository: IUserRepository,
    private trainerRepository: ITrainerRepository
  ) {}

  public async sendNotifications(userId: string): Promise<void> {
    const notifications = await this.notificationRepository.getAllNotifications(
      userId
    );

    io.to(userId).emit(SocketEvents.NOTIFICATION_GET, notifications);
  }

  public async sendCourseAddedNotification(
    trainerId: string,
    courseName: string
  ): Promise<void> {
    const userIds = await this.trainerRepository.getStudentsIds(trainerId);
    const trainer = await this.userRepository.findById(trainerId);

    const notifications = await this.notificationRepository.addNotifications(
      userIds,
      `${trainer!.username} has added a new course: ${courseName}`
    );

    notifications.forEach((notification) => {
      io.to(notification.userId.toString()).emit(
        SocketEvents.NOTIFICATION_NEW,
        {
          id: notification._id,
          message: notification.message,
          read: notification.read,
        }
      );
    });
  }
}

export default NotificationService;
