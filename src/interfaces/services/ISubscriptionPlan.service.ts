import { ISubscriptionFeatureId } from "../../constants/general";
import { ISubscriptionPlan } from "../../models/SubscriptionPlan.model";

export interface ISubscriptionPlanService {
  createSubscriptionPlan(
    title: string,
    description: string,
    price: number,
    duration: number,
    features: ISubscriptionFeatureId[]
  ): Promise<ISubscriptionPlan>;
  editSubscriptionPlan(
    subscriptionPlanId: string,
    title: string,
    description: string,
    price: number,
    duration: number,
    features: ISubscriptionFeatureId[]
  ): Promise<ISubscriptionPlan | null>;
  getSubscriptionPlans(
    search: string,
    page: number,
    size: number
  ): Promise<{
    subscriptionPlans: ISubscriptionPlan[];
    currentPage: number;
    totalPages: number;
  }>;
  getAllSubscriptionPlans(): Promise<ISubscriptionPlan[]>;
  changeSubscriptionPlanListingStatus(
    subscriptionPlanId: string
  ): Promise<boolean>;
  getSubscriptionPlanTitles(): Promise<ISubscriptionPlan[]>;
}
