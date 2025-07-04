import { IWishlist } from "../../models/Wishlist.model";

export interface IWishlistService {
  /**
   * Retrieves all wishlist items for a user. Used to display saved courses and enable quick access to favorites.
   */
  getUserWishlist(userId: string): Promise<Array<IWishlist>>;

  /**
   * Adds a course to a user's wishlist. Used to allow users to save courses for later consideration.
   */
  addToWishlist(userId: string, courseId: string): Promise<IWishlist>;

  /**
   * Removes a wishlist item by its identifier. Used for managing and cleaning up a user's wishlist.
   */
  removeFromWishlist(wishlistId: string): Promise<void>;

  /**
   * Removes a specific course from a user's wishlist. Used to support course removal by course ID.
   */
  removeCourseFromWishlist(userId: string, courseId: string): Promise<void>;

  /**
   * Checks if a course is already added to a user's wishlist. Used to prevent duplicates and update UI state.
   */
  checkCourseAddedToWishlist(
    userId: string,
    courseId: string
  ): Promise<boolean>;
}
