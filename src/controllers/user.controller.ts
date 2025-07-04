import { Request, Response, NextFunction } from "express";
import { updateProfileValidator } from "../validators/user.validator";
import { IUserService } from "../interfaces/services/IUser.service";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import binder from "../utils/binder";
import { paginatedGetDataValidator } from "../validators/pagination.validator";
import { INotificationService } from "../interfaces/services/INotification.service";
import {
  GeneralMessage,
  TrainerRequestMessage,
  UserMessage,
} from "../constants/responseMessages";

/**
 * Handles user profile management, trainer requests, and admin user actions.
 * All methods are bound for safe Express routing.
 */
class UserController {
  constructor(
    private userService: IUserService,
    private notificationService: INotificationService
  ) {
    // Ensures 'this' context is preserved for all methods
    binder(this);
  }

  /**
   * Updates the user's profile image. Returns an error if no image is provided to prevent incomplete profiles.
   */
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
          UserMessage.NoProfileImage,
          StatusCodes.BAD_REQUEST
        );
      }

      await this.userService.updateProfileImage(userID, profileImage.path);

      res.status(StatusCodes.OK).json(
        successResponse(UserMessage.ProfileImageUpdated, {
          profileImage: profileImage.path,
        })
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * Updates the user's profile details, supporting richer user information and personalization.
   */
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
        successResponse(UserMessage.ProfileUpdated, {
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

  /**
   * Sends a request for the user to become a trainer and notifies admins for approval.
   */
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
        .json(successResponse(TrainerRequestMessage.TrainerRequestSent));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves all users with pagination and search, supporting admin user management.
   */
  public async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, page, size } = paginatedGetDataValidator(req.query);

      const { users, currentPage, totalPages } =
        await this.userService.getUsers(search, page, size);

      res.status(StatusCodes.OK).json(
        successResponse(
          GeneralMessage.DataReturned,

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

  /**
   * Blocks or unblocks a user by admin action, supporting moderation and access control.
   */
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
          blockStatus ? UserMessage.UserBlocked : UserMessage.UserUnblocked,
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

  /**
   * Returns the total count of users for admin analytics and dashboard metrics.
   */
  public async getUsersCount(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.userService.getAdminUsersCount();

      res
        .status(StatusCodes.OK)
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }
}

export default UserController;
