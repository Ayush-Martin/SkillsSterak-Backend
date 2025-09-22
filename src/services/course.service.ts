import mongoose from "mongoose";
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
import { CourseMessage } from "../constants/responseMessages";

class CourseService implements ICourseService {
  constructor(private _courseRepository: ICourseRepository) {}

  public async createCourse(course: Partial<ICourse>): Promise<ICourse> {
    const { title } = course;
    const courseExist = await this._courseRepository.findCourseByTitle(title!);

    if (courseExist) {
      errorCreator(CourseMessage.CourseExists, StatusCodes.CONFLICT);
    }

    return await this._courseRepository.create(course);
  }

  public async getCourse(courseId: string): Promise<null | ICourse> {
    return await this._courseRepository.getCourse(courseId);
  }

  public async listUnListCourse(courseId: string): Promise<boolean> {
    const isListed = await this._courseRepository.getCourseListedStatus(
      courseId
    );
    if (isListed == null) {
      errorCreator(CourseMessage.CourseNotFound, StatusCodes.NOT_FOUND);
    }

    await this._courseRepository.changeListStatus(courseId, !isListed);
    return !isListed;
  }

  public async approveRejectCourse(
    courseId: string,
    status: "approved" | "rejected"
  ): Promise<void> {
    await this._courseRepository.changeCourseStatus(courseId, status);
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
    const courses = await this._courseRepository.getCourses(
      searchRegex,
      skip,
      size,
      filter,
      sortQuery
    );

    const totalCourses = await this._courseRepository.getCourseCount(
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
    return await this._courseRepository.getTrainerCourse(courseId);
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
    const courses = await this._courseRepository.getTrainerCourses(
      trainerId,
      searchRegex,
      skip,
      size
    );

    const totalCourses = await this._courseRepository.getTrainerCourseCount(
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
    const courses = await this._courseRepository.getAdminCourses(
      searchRegex,
      skip,
      size
    );

    const totalCourses = await this._courseRepository.getCourseCount(
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
    await this._courseRepository.changeThumbnail(courseId, thumbnail);
  }

  public async updateCourse(
    courseId: string,
    course: Partial<ICourse>
  ): Promise<void> {
    await this._courseRepository.updateById(courseId, course);
  }

  public async findById(courseId: string): Promise<ICourse | null> {
    return await this._courseRepository.findById(courseId);
  }

  public async getAdminCoursesCount(): Promise<number> {
    return await this._courseRepository.getAdminCourseCount(new RegExp(""));
  }

  public async getTrainerCoursesCount(trainerId: string): Promise<number> {
    return await this._courseRepository.getTrainerCourseCount(
      trainerId,
      new RegExp("")
    );
  }

  public async getAdminTop5Courses(): Promise<Array<ICourse>> {
    return await this._courseRepository.getAdminTop5Courses();
  }

  public async getTrainerTop5Courses(
    trainerId: string
  ): Promise<Array<ICourse>> {
    return await this._courseRepository.getTrainerTop5Courses(trainerId);
  }

  public async getAdminCourse(courseId: string): Promise<ICourse | null> {
    return await this._courseRepository.getAdminCourse(courseId);
  }

  public async getCourseCertificateDetails(
    courseId: string
  ): Promise<ICourse | null> {
    return await this._courseRepository.getCourseCertificateInfo(courseId);
  }

  public async getTrainerCoursesList(
    trainerId: string
  ): Promise<Array<ICourse>> {
    return await this._courseRepository.getTrainerCoursesList(trainerId);
  }
}

export default CourseService;
