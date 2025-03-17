import mongoose from "mongoose";
import { RECORDS_PER_PAGE } from "../constants/general";
import {
  COURSE_NOT_FOUND_ERROR_MESSAGE,
  COURSE_TITLE_EXIST_ERROR_MESSAGE,
} from "../constants/responseMessages";
import { ICourseRepository } from "../interfaces/repositories/ICourse.repository";
import { ICourseService } from "../interfaces/services/ICourse.service";
import { ICourse } from "../models/Course.model";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../constants/statusCodes";

class CourseService implements ICourseService {
  constructor(private courseRepository: ICourseRepository) {}

  public async createCourse(course: Partial<ICourse>): Promise<ICourse> {
    const { title } = course;
    const courseExist = await this.courseRepository.findCourseByTitle(title!);

    if (courseExist) {
      errorCreator(COURSE_TITLE_EXIST_ERROR_MESSAGE, StatusCodes.CONFLICT);
    }

    return await this.courseRepository.create(course);
  }

  public async getCourse(courseId: string): Promise<null | ICourse> {
    return await this.courseRepository.getCourse(courseId);
  }

  public async listUnListCourse(courseId: string): Promise<boolean> {
    const isListed = await this.courseRepository.getCourseListedStatus(
      courseId
    );
    if (isListed == null) {
      errorCreator(COURSE_NOT_FOUND_ERROR_MESSAGE, StatusCodes.NOT_FOUND);
    }

    await this.courseRepository.changeListStatus(courseId, !isListed);
    return !isListed;
  }

  public async approveRejectCourse(
    courseId: string,
    status: "approved" | "rejected"
  ): Promise<void> {
    await this.courseRepository.changeCourseStatus(courseId, status);
  }

  public async getCourses(
    search: string,
    page: number,
    category: string,
    difficulty: "all" | "beginner" | "intermediate" | "advance",
    price: "all" | "free" | "paid"
  ): Promise<{
    courses: Array<ICourse>;
    currentPage: number;
    totalPages: number;
  }> {
    const filter: {
      categoryId?: mongoose.Types.ObjectId;
      difficulty?: "beginner" | "intermediate" | "advance";
      price?: { $eq: 0 } | { $ne: 0 };
    } = {};

    if (category !== "all") {
      filter.categoryId = new mongoose.Types.ObjectId(category);
    }

    if (difficulty !== "all") {
      filter.difficulty = difficulty;
    }

    if (price !== "all") {
      filter.price = price === "free" ? { $eq: 0 } : { $ne: 0 };
    }

    const searchRegex = new RegExp(search, "i");
    const skip = (page - 1) * RECORDS_PER_PAGE;
    const courses = await this.courseRepository.getCourses(
      searchRegex,
      skip,
      RECORDS_PER_PAGE,
      filter
    );

    const totalCourses = await this.courseRepository.getCourseCount(
      searchRegex
    );
    const totalPages = Math.ceil(totalCourses / RECORDS_PER_PAGE);
    return {
      courses,
      currentPage: page,
      totalPages,
    };
  }

  public async getTrainerCourse(courseId: string): Promise<null | ICourse> {
    return await this.courseRepository.getTrainerCourse(courseId);
  }

  public async getTrainerCourses(
    trainerId: string,
    search: string,
    page: number
  ): Promise<{
    courses: Array<ICourse>;
    currentPage: number;
    totalPages: number;
  }> {
    const searchRegex = new RegExp(search, "i");
    const skip = (page - 1) * RECORDS_PER_PAGE;
    const courses = await this.courseRepository.getTrainerCourses(
      trainerId,
      searchRegex,
      skip,
      RECORDS_PER_PAGE
    );

    const totalCourses = await this.courseRepository.getTrainerCourseCount(
      trainerId,
      searchRegex
    );
    const totalPages = Math.ceil(totalCourses / RECORDS_PER_PAGE);
    return {
      courses,
      currentPage: page,
      totalPages,
    };
  }
  public async getAdminCourses(
    search: string,
    page: number
  ): Promise<{
    courses: Array<ICourse>;
    currentPage: number;
    totalPages: number;
  }> {
    const searchRegex = new RegExp(search, "i");
    const skip = (page - 1) * RECORDS_PER_PAGE;
    const courses = await this.courseRepository.getAdminCourses(
      searchRegex,
      skip,
      RECORDS_PER_PAGE
    );

    const totalCourses = await this.courseRepository.getCourseCount(
      searchRegex
    );
    const totalPages = Math.ceil(totalCourses / RECORDS_PER_PAGE);
    return {
      courses,
      currentPage: page,
      totalPages,
    };
  }

  public async changeCourseThumbnail(
    courseId: string,
    thumbnail: string
  ): Promise<void> {
    await this.courseRepository.changeThumbnail(courseId, thumbnail);
  }

  public async updateCourse(
    courseId: string,
    course: Partial<ICourse>
  ): Promise<void> {
    await this.courseRepository.updateById(courseId, course);
  }
}

export default CourseService;
