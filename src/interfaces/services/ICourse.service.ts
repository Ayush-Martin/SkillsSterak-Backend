import { ICourse } from "../../models/Course.model";

export interface ICourseService {
  createCourse(course: Partial<ICourse>): Promise<ICourse>;
  getCourse(courseId: string): Promise<null | ICourse>;
  getTrainerCourse(courseId: string): Promise<null | ICourse>;
  getCourses(
    search: string,
    page: number,
    category: string,
    difficulty: "all" | "beginner" | "intermediate" | "advance",
    price: "all" | "free" | "paid"
  ): Promise<{
    courses: Array<ICourse>;
    currentPage: number;
    totalPages: number;
  }>;
  listUnListCourse(courseId: string): Promise<boolean>;
  getTrainerCourses(
    trainerId: string,
    search: string,
    page: number
  ): Promise<{
    courses: Array<ICourse>;
    currentPage: number;
    totalPages: number;
  }>;
  getAdminCourses(
    search: string,
    page: number
  ): Promise<{
    courses: Array<ICourse>;
    currentPage: number;
    totalPages: number;
  }>;
  changeCourseThumbnail(courseId: string, thumbnail: string): Promise<void>;
  updateCourse(courseId: string, course: Partial<ICourse>): Promise<void>;
}
