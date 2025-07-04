import { IWishlist } from "./../../models/Wishlist.model";
import { IBaseRepository } from "./IBase.repository";

export interface IWishlistRepository extends IBaseRepository<IWishlist> {
  getUserWishlist(userId: string): Promise<Array<IWishlist>>;
  removeCourseFromWishlist(userId: string, courseId: string): Promise<void>;
  checkCourseAdded(userId: string, courseId: string): Promise<boolean>;
}
