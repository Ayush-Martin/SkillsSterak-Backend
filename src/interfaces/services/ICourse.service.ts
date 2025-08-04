import { ICourse } from "../../models/Course.model";
import {
  CourseDifficultyFilter,
  CoursePriceFilter,
  CourseSort,
} from "../../types/courseTypes";

export interface ICourseService {
  /**
   * Persists a new course to the database. Used when a trainer creates a course draft or submits a new course for review.
   */
  createCourse(course: Partial<ICourse>): Promise<ICourse>;

  /**
   * Fetches a course by its unique identifier. Returns null if not found. Used for course detail views and validation.
   */
  getCourse(courseId: string): Promise<null | ICourse>;

  /**
   * Fetches a course by ID, ensuring the requesting trainer is the owner. Used to enforce trainer-level access control.
   */
  getTrainerCourse(courseId: string): Promise<null | ICourse>;

  /**
   * Retrieves a paginated, filtered, and sorted list of courses for public or user-facing course discovery.
   * Supports searching, category, difficulty, price, and sorting options to optimize user experience.
   */
  getCourses(
    search: string,
    page: number,
    size: number,
    category: string,
    difficulty: CourseDifficultyFilter,
    price: CoursePriceFilter,
    sort: CourseSort
  ): Promise<{
    courses: Array<ICourse>;
    currentPage: number;
    totalPages: number;
  }>;

  /**
   * Toggles a course's visibility in the marketplace. Used by trainers to list or unlist their courses without deleting them.
   */
  listUnListCourse(courseId: string): Promise<boolean>;

  /**
   * Updates a course's approval status. Used by admins to approve or reject submitted courses for quality control.
   */
  approveRejectCourse(
    courseId: string,
    status: "approved" | "rejected"
  ): Promise<void>;

  /**
   * Returns a paginated list of courses owned by a specific trainer. Used for trainer dashboards and analytics.
   */
  getTrainerCourses(
    trainerId: string,
    search: string,
    page: number,
    size: number
  ): Promise<{
    courses: Array<ICourse>;
    currentPage: number;
    totalPages: number;
  }>;

  /**
   * Returns a paginated list of all courses for admin review and management. Used in admin dashboards.
   */
  getAdminCourses(
    search: string,
    page: number,
    size: number
  ): Promise<{
    courses: Array<ICourse>;
    currentPage: number;
    totalPages: number;
  }>;

  /**
   * Updates course details such as title, description, or metadata. Used by trainers to edit their courses.
   */
  updateCourse(courseId: string, course: Partial<ICourse>): Promise<void>;

  /**
   * Changes the thumbnail image for a course. Used to update course branding or visuals.
   */
  changeCourseThumbnail(courseId: string, thumbnail: string): Promise<void>;

  /**
   * Finds a course by its ID. Used internally for validation or relationship checks.
   */
  findById(courseId: string): Promise<ICourse | null>;

  /**
   * Returns the total number of courses in the system for admin analytics and reporting.
   */
  getAdminCoursesCount(): Promise<number>;

  /**
   * Returns the total number of courses owned by a specific trainer for dashboard statistics.
   */
  getTrainerCoursesCount(trainerId: string): Promise<number>;

  /**
   * Returns the top 5 courses system-wide based on engagement or ratings. Used for admin insights and highlights.
   */
  getAdminTop5Courses(): Promise<Array<ICourse>>;

  /**
   * Returns the top 5 courses for a specific trainer based on engagement or ratings. Used for trainer analytics.
   */
  getTrainerTop5Courses(trainerId: string): Promise<Array<ICourse>>;

  getAdminCourse(courseId: string): Promise<ICourse | null>;

  getCourseCertificateDetails(courseId: string): Promise<ICourse | null>;
}
