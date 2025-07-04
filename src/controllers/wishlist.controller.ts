import { Request, Response, NextFunction } from "express";
import { IWishlistService } from "../interfaces/services/IWishlist.service";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { GET_DATA_SUCCESS_MESSAGE } from "../constants/responseMessages";
import binder from "../utils/binder";

class WishlistController {
  constructor(private wishlistService: IWishlistService) {
    binder(this);
  }

  public async getUserWishlist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;

      const data = await this.wishlistService.getUserWishlist(userId);

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, data));
    } catch (err) {
      next(err);
    }
  }

  public async addToWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { courseId }: { courseId: string } = req.body;

      await this.wishlistService.addToWishlist(userId, courseId);

      res
        .status(StatusCodes.CREATED)
        .json(successResponse("course has added to wishlist"));
    } catch (err) {
      next(err);
    }
  }

  public async removeFromWishlist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { wishlistId } = req.params;

      await this.wishlistService.removeFromWishlist(wishlistId);

      res
        .status(StatusCodes.OK)
        .json(successResponse("course removed from wishlist"));
    } catch (err) {
      next(err);
    }
  }

  public async removeCourseFromWishlist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const { courseId } = req.params;

      await this.wishlistService.removeCourseFromWishlist(userId, courseId);

      res
        .status(StatusCodes.OK)
        .json(successResponse("course removed from wishlist"));
    } catch (err) {
      next(err);
    }
  }

  public async checkCourseAddedToWishlist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const { courseId } = req.params;

      const isAdded = await this.wishlistService.checkCourseAddedToWishlist(
        userId,
        courseId
      );

      res
        .status(StatusCodes.OK)
        .json(successResponse(GET_DATA_SUCCESS_MESSAGE, { isAdded }));
    } catch (err) {
      next(err);
    }
  }
}

export default WishlistController;
