import { Request, Response, NextFunction } from "express";
import { IWishlistService } from "../interfaces/services/IWishlist.service";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import binder from "../utils/binder";
import { GeneralMessage, WishlistMessage } from "../constants/responseMessages";

/**
 * Controller for handling wishlist-related endpoints.
 * Encapsulates user intent for managing course wishlists, ensuring
 * business logic is delegated to the service layer for maintainability.
 */
class WishlistController {
  /**
   * Binds all methods to the class instance to preserve context in Express routes.
   */
  constructor(private wishlistService: IWishlistService) {
    binder(this);
  }

  /**
   * Returns the wishlist for the authenticated user.
   * Useful for displaying saved courses or personalizing the user experience.
   */
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
        .json(successResponse(GeneralMessage.DataReturned, data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Adds a course to the user's wishlist.
   * Enables users to bookmark courses for future enrollment or review.
   */
  public async addToWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { courseId }: { courseId: string } = req.body;
      await this.wishlistService.addToWishlist(userId, courseId);
      res
        .status(StatusCodes.CREATED)
        .json(successResponse(WishlistMessage.courseAdded));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Removes a wishlist entry by its unique ID.
   * Used for direct deletion when the wishlist item identifier is known.
   */
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
        .json(successResponse(WishlistMessage.courseRemoved));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Removes a specific course from the user's wishlist.
   * Allows users to unmark courses they are no longer interested in.
   */
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
        .json(successResponse(WishlistMessage.courseRemoved));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Checks if a course is already present in the user's wishlist.
   * Supports UI logic for toggling wishlist state or preventing duplicates.
   */
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
        .json(successResponse(GeneralMessage.DataReturned, { isAdded }));
    } catch (err) {
      next(err);
    }
  }
}

export default WishlistController;
