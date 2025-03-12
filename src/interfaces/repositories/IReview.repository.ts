import { IReview } from "../../models/Review.model";
import { IBaseRepository } from "./IBase.repository";

export interface IReviewRepository extends IBaseRepository<IReview> {
  getReviewsByCourseId(courseId: string): Promise<IReview[]>;
}
