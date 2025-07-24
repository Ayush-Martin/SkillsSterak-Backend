import { ISubscriptionPlan } from "../../models/SubscriptionPlan.model";
import { IBaseRepository } from "./IBase.repository";

export interface ISubscriptionPlanRepository
  extends IBaseRepository<ISubscriptionPlan> {
  changeListingStatus(id: string, isListed: boolean): Promise<void>;
}
