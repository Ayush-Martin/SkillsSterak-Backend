import { Orders } from "razorpay/dist/types/orders";
import { IEnrolledCourses } from "../../models/EnrolledCourse.model";

export interface IEnrolledCoursesService {
  /** Enrolls a user in a course. */
  enrollCourse(
    userId: string,
    courseId: string
  ): Promise<Orders.RazorpayOrder | null>;

  /** Retrieves a paginated list of enrolled courses for a user. */
  getEnrolledCourses(
    userId: string,
    page: number,
    size: number
  ): Promise<{
    enrolledCourses: Array<IEnrolledCourses>;
    currentPage: number;
    totalPages: number;
  }>;

  /** Cancels a course purchase for a user. */
  cancelCoursePurchase(userId: string, courseId: string): Promise<void>;

  /** Retrieves a paginated list of completed enrolled courses for a user. */
  getCompletedEnrolledCourses(
    userId: string,
    page: number
  ): Promise<{
    completedEnrolledCourses: Array<IEnrolledCourses>;
    currentPage: number;
    totalPages: number;
  }>;

  /** Retrieves a specific enrolled course for a user. */
  getEnrolledCourse(
    userId: string,
    courseId: string
  ): Promise<IEnrolledCourses | null>;

  /** Checks if a user is enrolled in a course. */
  checkEnrolled(userId: string, courseId: string): Promise<boolean>;

  /** Completes a course purchase and returns user and course IDs. */
  completePurchase(
    orderId: string
  ): Promise<{ userId: string; courseId: string }>;

  /** Marks a lesson as complete or incomplete for a user in a course. */
  completeUnCompleteLesson(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<IEnrolledCourses | null>;
}
