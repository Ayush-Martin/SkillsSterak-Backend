import { Orders } from "razorpay/dist/types/orders";
import { IEnrolledCourses } from "../../models/EnrolledCourse.model";

export interface IEnrolledCoursesService {
  /** Enrolls a user in a course */
  enrollCourse(
    userId: string,
    courseId: string
  ): Promise<Orders.RazorpayOrder | null>;

  /** Retrieves the list of enrolled courses for a user */
  getEnrolledCourses(
    userId: string,
    page: number
  ): Promise<{
    enrolledCourses: Array<IEnrolledCourses>;
    currentPage: number;
    totalPages: number;
  }>;

  /** Retrieves the list of completed enrolled courses for a user */
  getCompletedEnrolledCourses(
    userId: string,
    page: number
  ): Promise<{
    completedEnrolledCourses: Array<IEnrolledCourses>;
    currentPage: number;
    totalPages: number;
  }>;

  /** Retrieves a specific enrolled course for a user */
  getEnrolledCourse(
    userId: string,
    courseId: string
  ): Promise<IEnrolledCourses | null>;

  /** Completes the purchase of a course */
  completePurchase(orderId: string): Promise<void>;

  /** Checks if a user is enrolled in a course */
  checkEnrolled(userId: string, courseId: string): Promise<boolean>;

  /** Completes or un-completes a lesson for a user's enrolled course */
  completeUnCompleteLesson(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<IEnrolledCourses | null>;
}
