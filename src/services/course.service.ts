import mongoose from "mongoose";
import {
  COURSE_NOT_FOUND_ERROR_MESSAGE,
  COURSE_TITLE_EXIST_ERROR_MESSAGE,
} from "../constants/responseMessages";
import { ICourseRepository } from "../interfaces/repositories/ICourse.repository";
import { ICourseService } from "../interfaces/services/ICourse.service";
import { ICourse } from "../models/Course.model";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../constants/statusCodes";
import {
  CourseDifficultyFilter,
  CoursePriceFilter,
  CourseSort,
} from "../types/courseTypes";

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
    size: number,
    category: string,
    difficulty: CourseDifficultyFilter,
    price: CoursePriceFilter,
    sort: CourseSort
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

    const sortQuery: {
      createdAt?: -1;
      price?: -1 | 1;
      title?: -1 | 1;
      noOfEnrolled?: -1;
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

    switch (sort) {
      case "new":
        sortQuery.createdAt = -1;
        break;
      case "priceLowToHigh":
        sortQuery.price = 1;
        break;
      case "priceHighToLow":
        sortQuery.price = -1;
        break;
      case "aA-zZ":
        sortQuery.title = 1;
        break;
      case "zZ-aA":
        sortQuery.title = -1;
        break;
      default:
        sortQuery.noOfEnrolled = -1;
    }

    const searchRegex = new RegExp(search, "i");
    const skip = (page - 1) * size;
    const courses = await this.courseRepository.getCourses(
      searchRegex,
      skip,
      size,
      filter,
      sortQuery
    );

    const totalCourses = await this.courseRepository.getCourseCount(
      searchRegex,
      filter
    );
    const totalPages = Math.ceil(totalCourses / size);
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
    page: number,
    size: number
  ): Promise<{
    courses: Array<ICourse>;
    currentPage: number;
    totalPages: number;
  }> {
    const searchRegex = new RegExp(search, "i");
    const skip = (page - 1) * size;
    const courses = await this.courseRepository.getTrainerCourses(
      trainerId,
      searchRegex,
      skip,
      size
    );

    const totalCourses = await this.courseRepository.getTrainerCourseCount(
      trainerId,
      searchRegex
    );
    const totalPages = Math.ceil(totalCourses / size);
    return {
      courses,
      currentPage: page,
      totalPages,
    };
  }

  public async getAdminCourses(
    search: string,
    page: number,
    size: number
  ): Promise<{
    courses: Array<ICourse>;
    currentPage: number;
    totalPages: number;
  }> {
    const searchRegex = new RegExp(search, "i");
    const skip = (page - 1) * size;
    const courses = await this.courseRepository.getAdminCourses(
      searchRegex,
      skip,
      size
    );

    const totalCourses = await this.courseRepository.getCourseCount(
      searchRegex,
      {}
    );
    const totalPages = Math.ceil(totalCourses / size);
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

  public async findById(courseId: string): Promise<ICourse | null> {
    return await this.courseRepository.findById(courseId);
  }

  public async getAdminCoursesCount(): Promise<number> {
    return await this.courseRepository.getAdminCourseCount(new RegExp(""));
  }

  public async getTrainerCoursesCount(trainerId: string): Promise<number> {
    return await this.courseRepository.getTrainerCourseCount(
      trainerId,
      new RegExp("")
    );
  }

  public async getAdminTop5Courses(): Promise<Array<ICourse>> {
    return await this.courseRepository.getAdminTop5Courses();
  }

  public async getTrainerTop5Courses(
    trainerId: string
  ): Promise<Array<ICourse>> {
    return await this.courseRepository.getTrainerTop5Courses(trainerId);
  }
}

export default CourseService;
