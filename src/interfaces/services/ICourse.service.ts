import { ICourse } from "../../models/Course.model";
import {
  CourseDifficultyFilter,
  CoursePriceFilter,
  CourseSort,
} from "../../types/courseTypes";

export interface ICourseService {
  /** Creates a new course */
  createCourse(course: Partial<ICourse>): Promise<ICourse>;
  /** Gets a course by id */
  getCourse(courseId: string): Promise<null | ICourse>;
  /** Gets a trainer course by id */
  getTrainerCourse(courseId: string): Promise<null | ICourse>;
  /** Gets courses */
  getCourses(
    search: string,
    page: number,
    limit: number,
    category: string,
    difficulty: CourseDifficultyFilter,
    price: CoursePriceFilter,
    sort: CourseSort
  ): Promise<{
    courses: Array<ICourse>;
    currentPage: number;
    totalPages: number;
  }>;
  /** Lists or unlists a course */
  listUnListCourse(courseId: string): Promise<boolean>;
  /** Approves or rejects a course */
  approveRejectCourse(
    courseId: string,
    status: "approved" | "rejected"
  ): Promise<void>;
  /** Gets trainer courses */
  getTrainerCourses(
    trainerId: string,
    search: string,
    page: number
  ): Promise<{
    courses: Array<ICourse>;
    currentPage: number;
    totalPages: number;
  }>;
  /** Gets courses for admin */
  getAdminCourses(
    search: string,
    page: number
  ): Promise<{
    courses: Array<ICourse>;
    currentPage: number;
    totalPages: number;
  }>;
  /** Changes the thumbnail of a course */
  changeCourseThumbnail(courseId: string, thumbnail: string): Promise<void>;
  /** Updates a course */
  updateCourse(courseId: string, course: Partial<ICourse>): Promise<void>;
}
