import { Request, Response, NextFunction } from "express";
import { ICourseService } from "../interfaces/services/ICourse.service";
import {
  aiChatValidator,
  approveRejectCourseValidator,
  createCourseValidator,
  getCoursesValidator,
  updateCourseBasicDetailsValidator,
} from "../validators/course.validator";
import { StatusCodes } from "../constants/statusCodes";
import { errorResponse, successResponse } from "../utils/responseCreators";
import binder from "../utils/binder";
import { paginatedGetDataValidator } from "../validators/pagination.validator";
import { getObjectId } from "../utils/objectId";
import NotificationService from "../services/notification.service";
import { IAiChatService } from "../interfaces/services/IAiChat.service";
import { IChatService } from "../interfaces/services/IChat.service";
import { CourseMessage, GeneralMessage } from "../constants/responseMessages";
import errorCreator from "../utils/customError";

class CourseController {
  constructor(
    private _courseService: ICourseService,
    private _notificationService: NotificationService,
    private _aiChatService: IAiChatService,
    private _chatService: IChatService
  ) {
    // Ensures 'this' context is preserved for all methods
    binder(this);
  }

  /**
   * Validates and creates a new course, then notifies the trainer.
   * Returns the created course in the response.
   */
  public async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const trainerId = getObjectId(req.userId!);
      const thumbnail = req.file;
      const courseData = createCourseValidator(req.body);

      if (!thumbnail) {
        errorCreator(CourseMessage.CourseNoThumbnail, StatusCodes.BAD_REQUEST);
        return;
      }

      const course = await this._courseService.createCourse({
        ...courseData,
        trainerId,
        thumbnail: thumbnail.path,
      });

      this._notificationService.sendCourseAddedNotification(
        req.userId!,
        course.title
      );

      res
        .status(StatusCodes.CREATED)
        .json(successResponse(CourseMessage.CourseCreated, course));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Handles AI-powered chat for a course, passing message and history to the AI service.
   */
  public async aiChat(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const { message, history } = aiChatValidator(req.body);

      const result = await this._aiChatService.courseChatHandler(
        courseId,
        message,
        history
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, result));
    } catch (err: any) {
      if (err.response?.status === StatusCodes.RATE_LIMIT) {
        console.error("Gemini rate limit error:", err);
        res
          .status(StatusCodes.RATE_LIMIT)
          .json(
            errorResponse("AI service limit reached. Please try again later.")
          );

        return;
      }

      next(err);
    }
  }

  /**
   * Retrieves a single course by its ID.
   */
  public async getCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;

      const course = await this._courseService.getCourse(courseId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, course));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Toggles a course's listed/unlisted status (soft visibility control).
   */
  public async listUnListCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const isListed = await this._courseService.listUnListCourse(courseId);

      res
        .status(StatusCodes.OK)
        .json(
          successResponse(
            isListed
              ? CourseMessage.CourseListed
              : CourseMessage.CourseUnlisted,
            { courseId, isListed }
          )
        );
    } catch (err) {
      next(err);
    }
  }

  /**
   * Approves or rejects a course and sends notifications accordingly.
   * If approved, also creates a group chat for the course.
   */
  public async approveRejectCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;

      const { status } = approveRejectCourseValidator(req.query);

      await this._courseService.approveRejectCourse(courseId, status);

      if (status === "approved") {
        this._notificationService.sendCourseApprovedNotification(courseId);
        const course = await this._courseService.findById(courseId);
        await this._chatService.createGroupChat(
          courseId,
          course?.trainerId as unknown as string
        );
      } else {
        this._notificationService.sendCourseRejectedNotification(courseId);
      }

      res
        .status(StatusCodes.OK)
        .json(
          successResponse(
            status == "approved"
              ? CourseMessage.CourseApproved
              : CourseMessage.CourseRejected,
            { courseId, status }
          )
        );
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves a trainer's course by its ID.
   */
  public async getTrainerCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;

      const course = await this._courseService.getTrainerCourse(courseId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, course));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Returns all courses for the authenticated trainer, paginated and searchable.
   */
  public async getTrainerCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, search, size } = paginatedGetDataValidator(req.query);
      const trainerId = req.userId!;

      const data = await this._courseService.getTrainerCourses(
        trainerId,
        search,
        page,
        size
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Returns all courses for admin, paginated and searchable.
   */
  public async getAdminCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, search, size } = paginatedGetDataValidator(req.query);

      const data = await this._courseService.getAdminCourses(
        search,
        page,
        size
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Returns all courses with advanced filters (search, category, difficulty, price, sort, pagination).
   */
  public async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, search, category, difficulty, price, size, sort } =
        getCoursesValidator(req.query);

      const data = await this._courseService.getCourses(
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
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Changes the thumbnail image for a course.
   */
  public async changeCourseThumbnail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const thumbnail = req.file;

      if (!thumbnail) {
        errorCreator(CourseMessage.CourseNoThumbnail, StatusCodes.BAD_REQUEST);
        return;
      }

      await this._courseService.changeCourseThumbnail(courseId, thumbnail.path);

      res
        .status(StatusCodes.OK)
        .json(successResponse(CourseMessage.ThumbnailUpdated, thumbnail.path));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Updates the basic details of a course (title, description, etc).
   */
  public async updateCourseBasicDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const data = updateCourseBasicDetailsValidator(req.body);

      await this._courseService.updateCourse(courseId, data);

      res
        .status(StatusCodes.OK)
        .json(successResponse(CourseMessage.BasicDetailsUpdated));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Returns the total count of courses for admin analytics.
   */
  public async getAdminCoursesCount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await this._courseService.getAdminCoursesCount();

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Returns the total count of courses for the authenticated trainer.
   */
  public async getTrainerCoursesCount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const data = await this._courseService.getTrainerCoursesCount(userId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Returns the top 5 courses for the authenticated trainer  by enrollments.
   */
  public async getTrainerTop5Courses(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const data = await this._courseService.getTrainerTop5Courses(userId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Returns the top 5 courses for admin by enrollments .
   */
  public async getAdminTop5Courses(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await this._courseService.getAdminTop5Courses();

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  public async getAdminCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const data = await this._courseService.getAdminCourse(courseId);
      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  public async getCourseCertificateDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const data = await this._courseService.getCourseCertificateDetails(
        courseId
      );
      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  public async getTrainerCoursesList(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const data = await this._courseService.getTrainerCoursesList(userId);
      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }
}

export default CourseController;
