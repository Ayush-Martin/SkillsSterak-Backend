import { Orders } from "razorpay/dist/types/orders";
import { IEnrolledCourses } from "../../models/EnrolledCourse.model";

export interface IEnrolledCoursesService {
  enrollCourse(
    userId: string,
    courseId: string
  ): Promise<Orders.RazorpayOrder | null>;
  getEnrolledCourses(
    userId: string,
    page: number
  ): Promise<{
    enrolledCourses: Array<IEnrolledCourses>;
    currentPage: number;
    totalPages: number;
  }>;
  getEnrolledCourse(
    userId: string,
    courseId: string
  ): Promise<IEnrolledCourses | null>;
  completePurchase(orderId: string): Promise<void>;
  checkEnrolled(userId: string, courseId: string): Promise<void>;
  completeUnCompleteLesson(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<IEnrolledCourses | null>;
}
