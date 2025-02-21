import { Request, Response, NextFunction } from "express";
import { IProfileService } from "../interfaces/services/IProfile.service";
import errorCreator from "../utils/customError";
import { StatusCodes } from "../utils/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { updateProfileValidator } from "../validators/profile.validator";

class ProfileController {
  constructor(private profileService: IProfileService) {}

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

      await this.profileService.updateProfileImage(userID, profileImage.path);

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

      await this.profileService.updateProfile(userId, {
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
