import { Request, Response, NextFunction } from "express";
import { updateProfileValidator } from "../validators/user.validator";
import { IUserService } from "../interfaces/services/IUser.service";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import {
  CHANGE_PROFILE_IMAGE_SUCCESS_MESSAGE,
  GET_DATA_SUCCESS_MESSAGE,
  NO_PROFILE_IMAGE_ERROR_MESSAGE,
  SEND_TRAINER_REQUEST_SUCCESS_MESSAGE,
  UPDATE_PROFILE_SUCCESS_MESSAGE,
  USER_BLOCKED_SUCCESS_MESSAGE,
  USER_UN_BLOCKED_SUCCESS_MESSAGE,
} from "../constants/responseMessages";
import binder from "../utils/binder";
import { paginatedGetDataValidator } from "../validators/pagination.validator";
import { INotificationService } from "../interfaces/services/INotification.service";

/** User controller: manages user profile, requests, and admin actions */
class UserController {
  /** Injects user and notification services */
  constructor(
    private userService: IUserService,
    private notificationService: INotificationService
  ) {
    binder(this);
  }

  /** Change user's profile image */
  public async changeProfileImage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const profileImage = req.file;
      const userID = req.userId!;

      if (!profileImage) {
        return errorCreator(
          NO_PROFILE_IMAGE_ERROR_MESSAGE,
          StatusCodes.BAD_REQUEST
        );
      }

      await this.userService.updateProfileImage(userID, profileImage.path);

      res.status(StatusCodes.OK).json(
        successResponse(CHANGE_PROFILE_IMAGE_SUCCESS_MESSAGE, {
          profileImage: profileImage.path,
        })
      );
    } catch (err) {
      next(err);
    }
  }

  /** Update user's profile details */
  public async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, bio, company, place, position, socialLinks } =
        updateProfileValidator(req.body);
      const userId = req.userId!;

      await this.userService.updateProfile(userId, {
        username,
        bio,
        company,
        place,
        position,
        socialLinks,
      });

      res.status(StatusCodes.OK).json(
        successResponse(UPDATE_PROFILE_SUCCESS_MESSAGE, {
          username,
          bio,
          company,
          place,
          position,
          socialLinks,
        })
      );
    } catch (err) {
      next(err);
    }
  }

  /** Send a request to become a trainer */
  public async sendTrainerRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;

      await this.userService.sendTrainerRequest(userId);
      this.notificationService.sendTrainerRequestNotification(userId);

      res
        .status(200)
        .json(successResponse(SEND_TRAINER_REQUEST_SUCCESS_MESSAGE));
    } catch (err) {
      next(err);
    }
  }

  /** Get all users with pagination and search */
  public async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, page, size } = paginatedGetDataValidator(req.query);

      const { users, currentPage, totalPages } =
        await this.userService.getUsers(search, page, size);

      res.status(StatusCodes.OK).json(
        successResponse(
          GET_DATA_SUCCESS_MESSAGE,

          {
            users,
            currentPage,
            totalPages,
          }
        )
      );
    } catch (err) {
      next(err);
    }
  }

  /** Block or unblock a user by admin */
  public async blockUnblockUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;
      const blockStatus = await this.userService.blockUnblockUser(userId);
      res.status(StatusCodes.OK).json(
        successResponse(
          blockStatus
            ? USER_BLOCKED_SUCCESS_MESSAGE
            : USER_UN_BLOCKED_SUCCESS_MESSAGE,
          {
            userId,
            blockStatus,
          }
        )
      );
    } catch (err) {
      next(err);
    }
  }
}

export default UserController;
