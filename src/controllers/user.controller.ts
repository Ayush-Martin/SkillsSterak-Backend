import { Request, Response, NextFunction } from "express";
import {
  getUsersValidator,
  updateProfileValidator,
} from "../validators/user.validator";
import { IUserService } from "../interfaces/services/IUser.service";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../utils/statusCodes";
import { successResponse } from "../utils/responseCreators";
import {
  CHANGE_PROFILE_IMAGE_SUCCESS_MESSAGE,
  GET_DATA_SUCCESS_MESSAGE,
  NO_PROFILE_IMAGE_ERROR_MESSAGE,
  SEND_TRAINER_REQUEST_SUCCESS_MESSAGE,
  UPDATE_PROFILE_SUCCESS_MESSAGE,
} from "../constants/responseMessages";
import binder from "../utils/binder";

class UserController {
  constructor(private userService: IUserService) {
    binder(this);
  }

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

  public async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, about } = updateProfileValidator(req.body);
      const userId = req.userId!;

      await this.userService.updateProfile(userId, {
        username,
        about,
      });

      res
        .status(StatusCodes.OK)
        .json(
          successResponse(UPDATE_PROFILE_SUCCESS_MESSAGE, { username, about })
        );
    } catch (err) {
      next(err);
    }
  }

  public async sendTrainerRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;

      await this.userService.sendTrainerRequest(userId);

      res
        .status(200)
        .json(successResponse(SEND_TRAINER_REQUEST_SUCCESS_MESSAGE));
    } catch (err) {
      next(err);
    }
  }

  public async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, page } = getUsersValidator(req.query);

      const { users, currentPage, totalPages } =
        await this.userService.getUsers(search, page);

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

  public async blockUnblockUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;
      const blockStatus = await this.userService.blockUnblockUser(userId);
      res.status(StatusCodes.OK).json(
        successResponse(`user is ${blockStatus ? "blocked" : "unblocked"}`, {
          userId,
          blockStatus,
        })
      );
    } catch (err) {
      next(err);
    }
  }
}

export default UserController;
