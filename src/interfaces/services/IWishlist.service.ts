import { IWishlist } from "../../models/Wishlist.model";

export interface IWishlistService {
  getUserWishlist(userId: string): Promise<Array<IWishlist>>;
  addToWishlist(userId: string, courseId: string): Promise<IWishlist>;
  removeFromWishlist(wishlistId: string): Promise<void>;
  removeCourseFromWishlist(userId: string, courseId: string): Promise<void>;
  checkCourseAddedToWishlist(
    userId: string,
    courseId: string
  ): Promise<boolean>;
}
