import { Request, Response, NextFunction } from "express";
import { ICourseService } from "../interfaces/services/ICourse.service";
import {
  approveRejectCourseValidator,
  createCourseValidator,
  getCoursesValidator,
  updateCourseBasicDetailsValidator,
  updateCourseRequirementsValidator,
  updateCourseSkillsCoveredValidator,
} from "../validators/course.validator";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import {
  COURSE_APPROVED_SUCCESS_MESSAGE,
  COURSE_CREATED_SUCCESS_MESSAGE,
  COURSE_LISTED_SUCCESS_MESSAGE,
  COURSE_REJECTED_SUCCESS_MESSAGE,
  COURSE_THUMBNAIL_CHANGE_SUCCESS_MESSAGE,
  COURSE_UN_LISTED_SUCCESS_MESSAGE,
  GET_DATA_SUCCESS_MESSAGE,
  UPDATED_COURSE_BASIC_DETAILS_SUCCESS_MESSAGE,
  UPDATED_COURSE_REQUIREMENTS_SUCCESS_MESSAGE,
  UPDATED_COURSE_SKILLS_COVERED_SUCCESS_MESSAGE,
} from "../constants/responseMessages";
import binder from "../utils/binder";
import { paginatedGetDataValidator } from "../validators/pagination.validator";
import { getObjectId } from "../utils/objectId";
import NotificationService from "../services/notification.service";
import { IAiChatService } from "../interfaces/services/IAiChat.service";
import { IChatService } from "../interfaces/services/IChat.service";

/** Course controller: manages course creation, updates, and queries */
class CourseController {
  /** Injects course, notification, AI chat, and chat services */
  constructor(
    private courseService: ICourseService,
    private notificationService: NotificationService,
    private aiChatService: IAiChatService,
    private chatService: IChatService
  ) {
    binder(this);
  }

  /** Create a new course */
  public async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const trainerId = getObjectId(req.userId!);
      const thumbnail = req.file;
      const courseData = createCourseValidator(req.body);

      if (!thumbnail) return;

      const course = await this.courseService.createCourse({
        ...courseData,
        trainerId,
        thumbnail: thumbnail.path,
      });

      this.notificationService.sendCourseAddedNotification(
        req.userId!,
        course.title
      );

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(COURSE_CREATED_SUCCESS_MESSAGE, course));
    } catch (err) {
      next(err);
    }
  }

  /** AI chat for course */
  public async aiChat(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const { message, history } = req.body;
      console.log("corseId", courseId);

      const result = await this.aiChatService.courseChatHandler(
        courseId,
        message,
        history
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, result));
    } catch (err) {
      next(err);
    }
  }

  /** Get a single course by ID */
  public async getCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;

      const course = await this.courseService.getCourse(courseId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, course));
    } catch (err) {
      next(err);
    }
  }

  /** Toggle course listed/unlisted */
  public async listUnListCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const isListed = await this.courseService.listUnListCourse(courseId);

      res
        .status(StatusCodes.OK)
        .json(
          successResponse(
            isListed
              ? COURSE_LISTED_SUCCESS_MESSAGE
              : COURSE_UN_LISTED_SUCCESS_MESSAGE,
            { courseId, isListed }
          )
        );
    } catch (err) {
      next(err);
    }
  }

  /** Approve or reject a course */
  public async approveRejectCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;

      const { status } = approveRejectCourseValidator(req.query);

      await this.courseService.approveRejectCourse(courseId, status);

      if (status === "approved") {
        this.notificationService.sendCourseApprovedNotification(courseId);
        const course = await this.courseService.findById(courseId);
        await this.chatService.createGroupChat(
          courseId,
          course?.trainerId as unknown as string
        );
      } else {
        this.notificationService.sendCourseRejectedNotification(courseId);
      }

      // status == "approved"
      //   ? this.notificationService.sendCourseApprovedNotification(courseId)
      //   : this.notificationService.sendCourseRejectedNotification(courseId);

      res
        .status(StatusCodes.OK)
        .json(
          successResponse(
            status == "approved"
              ? COURSE_APPROVED_SUCCESS_MESSAGE
              : COURSE_REJECTED_SUCCESS_MESSAGE,
            { courseId, status }
          )
        );
    } catch (err) {
      next(err);
    }
  }

  /** Get a trainer's course by ID */
  public async getTrainerCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;

      const course = await this.courseService.getTrainerCourse(courseId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, course));
    } catch (err) {
      next(err);
    }
  }

  /** Get all courses for a trainer */
  public async getTrainerCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, search, size } = paginatedGetDataValidator(req.query);
      const trainerId = req.userId!;

      const data = await this.courseService.getTrainerCourses(
        trainerId,
        search,
        page,
        size
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }

  /** Get all courses for admin */
  public async getAdminCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, search, size } = paginatedGetDataValidator(req.query);

      const data = await this.courseService.getAdminCourses(search, page, size);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }

  /** Get all courses with filters */
  public async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, search, category, difficulty, price, size, sort } =
        getCoursesValidator(req.query);

      const data = await this.courseService.getCourses(
        search,
        page,
        size,
        category,
        difficulty,
        price,
        sort
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }

  /** Change course thumbnail */
  public async changeCourseThumbnail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const thumbnail = req.file;

      if (!thumbnail) return;

      await this.courseService.changeCourseThumbnail(courseId, thumbnail.path);

      res
        .status(StatusCodes.OK)
        .json(
          successResponse(
            COURSE_THUMBNAIL_CHANGE_SUCCESS_MESSAGE,
            thumbnail.path
          )
        );
    } catch (err) {
      next(err);
    }
  }

  /** Update course basic details */
  public async updateCourseBasicDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const data = updateCourseBasicDetailsValidator(req.body);

      await this.courseService.updateCourse(courseId, data);

      res
        .status(StatusCodes.OK)
        .json(successResponse(UPDATED_COURSE_BASIC_DETAILS_SUCCESS_MESSAGE));
    } catch (err) {
      next(err);
    }
  }

  /** Update course requirements */
  public async updateCourseRequirements(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const data = updateCourseRequirementsValidator(req.body);

      await this.courseService.updateCourse(courseId, data);

      res
        .status(StatusCodes.OK)
        .json(successResponse(UPDATED_COURSE_REQUIREMENTS_SUCCESS_MESSAGE));
    } catch (err) {
      next(err);
    }
  }

  /** Update course skills covered */
  public async updateCourseSkillsCovered(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const data = updateCourseSkillsCoveredValidator(req.body);

      await this.courseService.updateCourse(courseId, data);

      res
        .status(StatusCodes.OK)
        .json(successResponse(UPDATED_COURSE_SKILLS_COVERED_SUCCESS_MESSAGE));
    } catch (err) {
      next(err);
    }
  }
}

export default CourseController;
