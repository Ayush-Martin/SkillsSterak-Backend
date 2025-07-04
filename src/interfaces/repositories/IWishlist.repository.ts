import { IWishlist } from "./../../models/Wishlist.model";
import { IBaseRepository } from "./IBase.repository";

/**
 * Repository interface for wishlist-related data operations.
 * Supports user bookmarking, wishlist management, and course discovery features.
 */
export interface IWishlistRepository extends IBaseRepository<IWishlist> {
  /**
   * Retrieves the wishlist for a specific user.
   * Enables users to view and manage their saved courses.
   */
  getUserWishlist(userId: string): Promise<Array<IWishlist>>;

  /**
   * Removes a course from a user's wishlist.
   * Supports user-driven wishlist management and course un bookmarking.
   */
  removeCourseFromWishlist(userId: string, courseId: string): Promise<void>;

  /**
   * Checks if a course is already added to a user's wishlist.
   * Enables UI toggling and prevents duplicate wishlist entries.
   */
  checkCourseAdded(userId: string, courseId: string): Promise<boolean>;
}
