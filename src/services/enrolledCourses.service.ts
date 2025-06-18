import { IEnrolledCoursesRepository } from "../interfaces/repositories/IEnrolledCourses.repository";
import { IEnrolledCoursesService } from "../interfaces/services/IEnrolledCourses.service";
import { IEnrolledCourses } from "../models/EnrolledCourse.model";
import razorpay from "../config/razorpay";
import { ICourseRepository } from "../interfaces/repositories/ICourse.repository";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../constants/statusCodes";
import { Orders } from "razorpay/dist/types/orders";
import { IWalletRepository } from "../interfaces/repositories/IWallet.repository";
import { ITransactionRepository } from "../interfaces/repositories/ITransaction.repository";
import { COURSE_COMMISSION_RATE, RECORDS_PER_PAGE } from "../constants/general";
import {
  COURSE_ACCESS_ERROR_MESSAGE,
  COURSE_NOT_FOUND_ERROR_MESSAGE,
  ORDER_NOT_FOUND_ERROR_MESSAGE,
  ORDER_NOT_PAID_ERROR_MESSAGE,
} from "../constants/responseMessages";
import { getObjectId } from "../utils/objectId";
import { IChatRepository } from "../interfaces/repositories/IChat.repository";

class EnrolledCourses implements IEnrolledCoursesService {
  constructor(
    private enrolledCoursesRepository: IEnrolledCoursesRepository,
    private courseRepository: ICourseRepository,
    private walletRepository: IWalletRepository,
    private transactionRepository: ITransactionRepository,
    private chatRepository: IChatRepository
  ) {}

  public async enrollCourse(
    userId: string,
    courseId: string
  ): Promise<Orders.RazorpayOrder | null> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) return errorCreator("Course not found", StatusCodes.NOT_FOUND);

    if (course.price === 0 || String(course.trainerId) == String(userId)) {
      await this.enrolledCoursesRepository.create({
        userId: getObjectId(userId),
        courseId: getObjectId(courseId),
      });

      await this.chatRepository.addMemberToChat(courseId, userId);

      return null;
    }

    const order = await razorpay.orders.create({
      amount: course.price * 100, // amount in paise
      currency: "INR",
      receipt: "order_rcpt_id_11",
      notes: {
        userId,
        courseId,
      },
    });

    return order;
  }

  public async completePurchase(
    orderId: string
  ): Promise<{ userId: string; courseId: string }> {
    const order = await razorpay.orders.fetch(orderId);

    const userId = order.notes?.userId as string | undefined;
    const courseId = order.notes?.courseId as string | undefined;

    const course = await this.courseRepository.findById(courseId as string);
    if (!course) return errorCreator("Course not found", StatusCodes.NOT_FOUND);

    if (!userId || !courseId) {
      return errorCreator(ORDER_NOT_FOUND_ERROR_MESSAGE, StatusCodes.NOT_FOUND);
    }

    if (order.status !== "paid") {
      return errorCreator(
        ORDER_NOT_PAID_ERROR_MESSAGE,
        StatusCodes.BAD_REQUEST
      );
    }

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

  public async cancelCoursePurchase(
    userId: string,
    courseId: string
  ): Promise<void> {
    const enrolledCourse =
      await this.enrolledCoursesRepository.getEnrolledCourseByCourseId(
        userId,
        courseId
      );

    if (!enrolledCourse || !enrolledCourse.createdAt) {
      return errorCreator(COURSE_ACCESS_ERROR_MESSAGE, StatusCodes.NOT_FOUND);
    }

    const course = await this.courseRepository.findById(
      enrolledCourse.courseId.toString()
    );

    if (!course)
      return errorCreator(
        COURSE_NOT_FOUND_ERROR_MESSAGE,
        StatusCodes.NOT_FOUND
      );

    if (course.price === 0 || String(course.trainerId) == String(userId)) {
      return await this.enrolledCoursesRepository.deleteById(enrolledCourse.id);
    }

    console.log(
      enrolledCourse.createdAt.getTime() + 24 * 60 * 60 * 1000 <
        new Date().getTime(),
      enrolledCourse.createdAt.getTime()
    );

    if (
      new Date().getTime() >=
      enrolledCourse.createdAt.getTime() + 24 * 60 * 60 * 1000
    ) {
      return errorCreator(
        "refund not available after 24 hours",
        StatusCodes.BAD_REQUEST
      );
    }

    await this.enrolledCoursesRepository.deleteById(enrolledCourse.id);
    await this.walletRepository.debitWallet(
      userId,
      course.price - course.price * COURSE_COMMISSION_RATE
    );
    await this.transactionRepository.create({
      payerId: course?.trainerId,
      courseId: getObjectId(courseId),
      amount: course.price - course.price * COURSE_COMMISSION_RATE,
      type: "refund",
    });

    await this.transactionRepository.create({
      receiverId: getObjectId(userId),
      courseId: getObjectId(courseId),
      amount: course.price,
      type: "refund",
    });
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
      return errorCreator(COURSE_ACCESS_ERROR_MESSAGE, StatusCodes.FORBIDDEN);
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
}

export default EnrolledCourses;
