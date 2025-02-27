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
}

export default CourseService;
