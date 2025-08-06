import { ISubscriptionPlan } from "../../models/SubscriptionPlan.model";
import { IBaseRepository } from "./IBase.repository";

export interface ISubscriptionPlanRepository
  extends IBaseRepository<ISubscriptionPlan> {
  changeListingStatus(id: string, isListed: boolean): Promise<void>;
  getSubscriptionPlansCount(): Promise<number>;
  getSubscriptionPlans(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<ISubscriptionPlan[]>;
  getSubscriptionPlanById(id: string): Promise<ISubscriptionPlan | null>;
  getAllListedSubscriptionPlans(): Promise<ISubscriptionPlan[]>;
  getAllSubscriptionPlans(): Promise<ISubscriptionPlan[]>;
}
