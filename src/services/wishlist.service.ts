import { IWishlistRepository } from "../interfaces/repositories/IWishlist.repository";
import { IWishlistService } from "../interfaces/services/IWishlist.service";
import { IWishlist } from "../models/Wishlist.model";
import { getObjectId } from "../utils/objectId";

class WishlistService implements IWishlistService {
  constructor(private wishlistRepository: IWishlistRepository) {}

  public async addToWishlist(
    userId: string,
    courseId: string
  ): Promise<IWishlist> {
    return await this.wishlistRepository.create({
      userId: getObjectId(userId),
      courseId: getObjectId(courseId),
    });
  }

  public async removeFromWishlist(wishlistId: string): Promise<void> {
    await this.wishlistRepository.deleteById(wishlistId);
  }

  public async getUserWishlist(userId: string): Promise<Array<IWishlist>> {
    const wishlist = await this.wishlistRepository.getUserWishlist(userId);
    console.log(wishlist);
    return wishlist;
  }

  public async removeCourseFromWishlist(
    userId: string,
    courseId: string
  ): Promise<void> {
    return await this.wishlistRepository.removeCourseFromWishlist(
      userId,
      courseId
    );
  }

  public async checkCourseAddedToWishlist(
    userId: string,
    courseId: string
  ): Promise<boolean> {
    return await this.wishlistRepository.checkCourseAdded(userId, courseId);
  }
}

export default WishlistService;
