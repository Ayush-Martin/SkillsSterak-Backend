import { ICourse } from "../../models/Course.model";
import {
  CourseDifficultyFilter,
  CoursePriceFilter,
  CourseSort,
} from "../../types/courseTypes";

export interface ICourseService {
  /** Creates a new course. */
  createCourse(course: Partial<ICourse>): Promise<ICourse>;
  /** Retrieves a course by its ID. */
  getCourse(courseId: string): Promise<null | ICourse>;
  /** Retrieves a trainer's course by its ID. */
  getTrainerCourse(courseId: string): Promise<null | ICourse>;
  /** Retrieves a paginated list of courses with filters. */
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
  /** Toggles the listed/unlisted status of a course. */
  listUnListCourse(courseId: string): Promise<boolean>;
  /** Approves or rejects a course. */
  approveRejectCourse(
    courseId: string,
    status: "approved" | "rejected"
  ): Promise<void>;
  /** Retrieves a paginated list of courses for a trainer. */
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
  /** Retrieves a paginated list of courses for admin. */
  getAdminCourses(
    search: string,
    page: number,
    size: number
  ): Promise<{
    courses: Array<ICourse>;
    currentPage: number;
    totalPages: number;
  }>;
  /** Updates course details. */
  updateCourse(courseId: string, course: Partial<ICourse>): Promise<void>;
  /** Changes the thumbnail of a course. */
  changeCourseThumbnail(courseId: string, thumbnail: string): Promise<void>;
  /** Finds a course by its ID. */
  findById(courseId: string): Promise<ICourse | null>;
}
