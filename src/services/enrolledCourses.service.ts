import { IEnrolledCoursesRepository } from "../interfaces/repositories/IEnrolledCourses.repository";
import { IEnrolledCoursesService } from "../interfaces/services/IEnrolledCourses.service";
import { IEnrolledCourses } from "../models/EnrolledCourse.model";
import { ICourseRepository } from "../interfaces/repositories/ICourse.repository";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../constants/statusCodes";
import { IWalletRepository } from "../interfaces/repositories/IWallet.repository";
import { ITransactionRepository } from "../interfaces/repositories/ITransaction.repository";
import { RECORDS_PER_PAGE } from "../constants/general";
import { getObjectId } from "../utils/objectId";
import { IChatRepository } from "../interfaces/repositories/IChat.repository";
import stripe from "../config/stripe";
import envConfig from "../config/env";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { CourseMessage } from "../constants/responseMessages";

class EnrolledCourses implements IEnrolledCoursesService {
  constructor(
    private enrolledCoursesRepository: IEnrolledCoursesRepository,
    private courseRepository: ICourseRepository,
    private walletRepository: IWalletRepository,
    private transactionRepository: ITransactionRepository,
    private chatRepository: IChatRepository,
    private userRepository: IUserRepository
  ) {}

  public async enrollCourse(
    userId: string,
    courseId: string
  ): Promise<string | null> {
    const course = await this.courseRepository.findById(courseId);
    const user = await this.userRepository.findById(userId);
    if (!course) return errorCreator("Course not found", StatusCodes.NOT_FOUND);

    if (course.price === 0 || String(course.trainerId) == String(userId)) {
      await this.enrolledCoursesRepository.create({
        userId: getObjectId(userId),
        courseId: getObjectId(courseId),
      });

      await this.chatRepository.addMemberToChat(courseId, userId);

      return null;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: course.title },
            unit_amount: course.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: envConfig.FRONTEND_DOMAIN + "/payment/success",
      cancel_url: envConfig.FRONTEND_DOMAIN + "/payment/failure",
      metadata: {
        userId,
        courseId,
      },
      customer_email: user?.email,
    });

    return session.id;
  }

  public async completePurchase(
    userId: string,
    courseId: string
  ): Promise<{ userId: string; courseId: string }> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) return errorCreator("Course not found", StatusCodes.NOT_FOUND);

    await this.enrolledCoursesRepository.create({
      userId: getObjectId(userId),
      courseId: getObjectId(courseId),
    });

    await this.walletRepository.creditWallet(
      course?.trainerId as unknown as string,
      course?.price
    );

    await this.transactionRepository.create({
      payerId: getObjectId(userId),
      receiverId: course?.trainerId,
      courseId: getObjectId(courseId),
      amount: course.price,
      type: "payment",
    });

    return { userId, courseId };
  }

  public async getEnrolledCourses(
    userId: string,
    page: number,
    size: number
  ): Promise<{
    enrolledCourses: Array<IEnrolledCourses>;
    currentPage: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * size;
    const enrolledCourses =
      await this.enrolledCoursesRepository.getEnrolledCourses(
        userId,
        skip,
        size
      );

    const enrolledCoursesCount =
      await this.enrolledCoursesRepository.getEnrolledCoursesCount(userId);

    const totalPages = Math.ceil(enrolledCoursesCount / size);
    return { enrolledCourses, currentPage: page, totalPages };
  }

  public async getCompletedEnrolledCourses(
    userId: string,
    page: number
  ): Promise<{
    completedEnrolledCourses: Array<IEnrolledCourses>;
    currentPage: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * RECORDS_PER_PAGE;
    const completedEnrolledCourses =
      await this.enrolledCoursesRepository.getComptedEnrolledCourses(
        userId,
        skip,
        RECORDS_PER_PAGE
      );

    const completedEnrolledCoursesCount =
      await this.enrolledCoursesRepository.getCompletedEnrolledCoursesCount(
        userId
      );

    const totalPages = Math.ceil(
      completedEnrolledCoursesCount / RECORDS_PER_PAGE
    );
    return { completedEnrolledCourses, currentPage: page, totalPages };
  }

  public async getEnrolledCourse(
    userId: string,
    courseId: string
  ): Promise<IEnrolledCourses | null> {
    return await this.enrolledCoursesRepository.getEnrolledCourseByCourseId(
      userId,
      courseId
    );
  }

  public async checkEnrolled(
    userId: string,
    courseId: string
  ): Promise<boolean> {
    const enrolledData = await this.enrolledCoursesRepository.checkEnrolled(
      userId,
      courseId
    );

    if (enrolledData) {
      return true;
    } else {
      return false;
    }
  }

  public async completeUnCompleteLesson(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<IEnrolledCourses | null> {
    const enrolledCourse =
      await this.enrolledCoursesRepository.getEnrolledCourseByCourseId(
        userId,
        courseId
      );

    if (!enrolledCourse) {
      return errorCreator(CourseMessage.NoCourseAccess, StatusCodes.FORBIDDEN);
    }

    if (enrolledCourse.completedLessons?.includes(getObjectId(lessonId))) {
      return await this.enrolledCoursesRepository.removeLessonComplete(
        userId,
        courseId,
        lessonId
      );
    }

    return await this.enrolledCoursesRepository.addLessonComplete(
      userId,
      courseId,
      lessonId
    );
  }

  public async getCompletionProgress(
    userId: string
  ): Promise<IEnrolledCourses> {
    return await this.enrolledCoursesRepository.getProgress(userId);
  }
}

export default EnrolledCourses;
