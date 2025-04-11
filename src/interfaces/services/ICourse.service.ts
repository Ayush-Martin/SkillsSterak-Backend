import { ICourse } from "../../models/Course.model";
import {
  CourseDifficultyFilter,
  CoursePriceFilter,
  CourseSort,
} from "../../types/courseTypes";

export interface ICourseService {
  createCourse(course: Partial<ICourse>): Promise<ICourse>;
  getCourse(courseId: string): Promise<null | ICourse>;
  getTrainerCourse(courseId: string): Promise<null | ICourse>;
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
  listUnListCourse(courseId: string): Promise<boolean>;
  approveRejectCourse(
    courseId: string,
    status: "approved" | "rejected"
  ): Promise<void>;
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
  getAdminCourses(
    search: string,
    page: number,
    size: number
  ): Promise<{
    courses: Array<ICourse>;
    currentPage: number;
    totalPages: number;
  }>;
  updateCourse(courseId: string, course: Partial<ICourse>): Promise<void>;
  changeCourseThumbnail(courseId: string, thumbnail: string): Promise<void>;
}
