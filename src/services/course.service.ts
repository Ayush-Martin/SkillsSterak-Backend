import { RECORDS_PER_PAGE } from "../constants/general";
import { COURSE_TITLE_EXIST_ERROR_MESSAGE } from "../constants/responseMessages";
import { ICourseRepository } from "../interfaces/repositories/ICourse.repository";
import { ICourseService } from "../interfaces/services/ICourse.service";
import { ICourse } from "../models/Course.model";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../utils/statusCodes";

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

  public async getCourses(
    search: string,
    page: number
  ): Promise<{
    courses: Array<ICourse>;
    currentPage: number;
    totalPages: number;
  }> {
    const searchRegex = new RegExp(search, "i");
    const skip = (page - 1) * RECORDS_PER_PAGE;
    const courses = await this.courseRepository.getCourses(
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
