import { Orders } from "razorpay/dist/types/orders";
import { IEnrolledCourses } from "../../models/EnrolledCourse.model";

export interface IEnrolledCoursesService {
  enrollCourse(
    userId: string,
    courseId: string
  ): Promise<Orders.RazorpayOrder | null>;

  getEnrolledCourses(
    userId: string,
    page: number,
    size: number
  ): Promise<{
    enrolledCourses: Array<IEnrolledCourses>;
    currentPage: number;
    totalPages: number;
  }>;

  cancelCoursePurchase(userId: string, courseId: string): Promise<void>;

  getCompletedEnrolledCourses(
    userId: string,
    page: number
  ): Promise<{
    completedEnrolledCourses: Array<IEnrolledCourses>;
    currentPage: number;
    totalPages: number;
  }>;

  getEnrolledCourse(
    userId: string,
    courseId: string
  ): Promise<IEnrolledCourses | null>;

  checkEnrolled(userId: string, courseId: string): Promise<boolean>;

  completePurchase(orderId: string): Promise<void>;

  completeUnCompleteLesson(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<IEnrolledCourses | null>;
}
