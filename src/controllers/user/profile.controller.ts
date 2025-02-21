import { Request, Response, NextFunction } from "express";
import { updateProfileValidator } from "../../validators/profile.validator";
import { IUserService } from "../../interfaces/services/IUser.service";
import errorCreator from "../../utils/customError";
import { StatusCodes } from "../../utils/statusCodes";
import { successResponse } from "../../utils/responseCreators";

class ProfileController {
  constructor(private userService: IUserService) {}

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
          "profile image is not given",
          StatusCodes.BAD_REQUEST
        );
      }

      await this.userService.updateProfileImage(userID, profileImage.path);

      res.status(StatusCodes.OK).json(
        successResponse("profile image is updated", {
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
        .json(successResponse("profile updated", { username, about }));
    } catch (err) {
      next(err);
    }
  }

  
}

export default ProfileController;
