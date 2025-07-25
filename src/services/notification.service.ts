import { INotificationRepository } from "../interfaces/repositories/INotification.repository";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { ITrainerRepository } from "../interfaces/repositories/ITrainer.repository";
import { SocketEvents } from "../constants/socketEvents";
import { io } from "..";
import { INotificationService } from "../interfaces/services/INotification.service";
import { ICourseRepository } from "../interfaces/repositories/ICourse.repository";

class NotificationService implements INotificationService {
  constructor(
    private _notificationRepository: INotificationRepository,
    private _userRepository: IUserRepository,
    private _trainerRepository: ITrainerRepository,
    private _courseRepository: ICourseRepository
  ) {}

  public async sendUserNotifications(userId: string): Promise<void> {
    const notifications = await this._notificationRepository.getAllNotifications(
      userId
    );

    io.to(userId).emit(SocketEvents.NOTIFICATION_GET, notifications);
  }

  public async markAsRead(notificationId: string): Promise<void> {
    await this._notificationRepository.markAsRead(notificationId);
  }

  public async sendCourseAddedNotification(
    trainerId: string,
    courseName: string
  ): Promise<void> {
    const admin = await this._userRepository.getAdmin();
    const trainer = await this._userRepository.findById(trainerId);

    const adminNotification = await this._notificationRepository.addNotification(
      admin?.id,
      `${trainer!.username} has added a new course: ${courseName}`
    );

    io.to(admin?.id).emit(SocketEvents.NOTIFICATION_NEW, adminNotification);
  }

  public async sendCourseApprovedNotification(courseId: string): Promise<void> {
    const course = await this._courseRepository.findById(courseId);
    const trainer = await this._userRepository.findById(
      course?.trainerId.toString()!
    );
    const userIds = await this._trainerRepository.getStudentsIds(
      trainer?.id as string
    );

    const userNotifications =
      await this._notificationRepository.addNotifications(
        userIds,
        `${trainer!.username} has added a new course: ${course?.title}`
      );

    const trainerNotification =
      await this._notificationRepository.addNotification(
        trainer?.id,
        `course ${course?.title} approved by admin`
      );


    userNotifications.forEach((notification) => {
      io.to(notification.userId.toString()).emit(
        SocketEvents.NOTIFICATION_NEW,
        {
          id: notification._id,
          message: notification.message,
        }
      );
    });

    io.to(trainer?.id).emit(SocketEvents.NOTIFICATION_NEW, trainerNotification);
  }

  public async sendCourseRejectedNotification(courseId: string): Promise<void> {
    const course = await this._courseRepository.findById(courseId);

    const trainerNotification =
      await this._notificationRepository.addNotification(
        course?.trainerId.toString()!,
        `course ${course?.title} rejected by admin`
      );

    io.to(course?.trainerId.toString()!).emit(
      SocketEvents.NOTIFICATION_NEW,
      trainerNotification
    );
  }

  public async sendTrainerRequestNotification(userId: string): Promise<void> {
    const admin = await this._userRepository.getAdmin();
    const user = await this._userRepository.findById(userId);
    const adminNotification = await this._notificationRepository.addNotification(
      admin?.id,
      `${user?.username} has sent a trainer request`
    );
    io.to(admin?.id).emit(SocketEvents.NOTIFICATION_NEW, adminNotification);
  }

  public async sendApproveTrainerRequestNotification(
    userId: string
  ): Promise<void> {
    const notification = await this._notificationRepository.addNotification(
      userId,
      "admin approved your trainer request"
    );
    io.to(userId).emit(SocketEvents.NOTIFICATION_NEW, notification);
  }

  public async sendRejectTrainerRequestNotification(
    userId: string
  ): Promise<void> {
    const notification = await this._notificationRepository.addNotification(
      userId,
      "admin rejected your trainer request"
    );
    io.to(userId).emit(SocketEvents.NOTIFICATION_NEW, notification);
  }
}

export default NotificationService;
