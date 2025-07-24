import { ISubscriptionPlanRepository } from "../interfaces/repositories/ISubscriptionPlan.repository";
import { ISubscriptionPlanService } from "../interfaces/services/ISubscriptionPlan.service";
import { ISubscriptionPlan } from "../models/SubscriptionPlan.model";

class SubscriptionPlanService implements ISubscriptionPlanService {
  constructor(
    private _subscriptionPlanRepository: ISubscriptionPlanRepository
  ) {}

  public async createSubscriptionPlan(
    title: string,
    description: string,
    price: number,
    duration: number
  ): Promise<ISubscriptionPlan> {
    return await this._subscriptionPlanRepository.create({
      title,
      description,
      price,
      duration,
    });
  }

  public async getAllSubscriptionPlans(): Promise<ISubscriptionPlan[]> {
    return await this._subscriptionPlanRepository.findAll();
  }

  public async changeSubscriptionPlanListingStatus(
    subscriptionPlanId: string
  ): Promise<boolean> {
    const subscriptionPlan =
      await this._subscriptionPlanRepository.getSubscriptionPlanById(
        subscriptionPlanId
      );

    await this._subscriptionPlanRepository.changeListingStatus(
      subscriptionPlanId,
      !subscriptionPlan?.isListed
    );

    return !subscriptionPlan?.isListed;
  }

  public async getSubscriptionPlans(
    search: string,
    page: number,
    size: number
  ): Promise<{
    subscriptionPlans: ISubscriptionPlan[];
    currentPage: number;
    totalPages: number;
  }> {
    const searchRegex = new RegExp(search, "i");
    const skip = (page - 1) * size;

    const subscriptionPlans =
      await this._subscriptionPlanRepository.getSubscriptionPlans(
        searchRegex,
        skip,
        size
      );

    const totalSubscriptionPlans =
      await this._subscriptionPlanRepository.getSubscriptionPlansCount();

    const totalPages = Math.ceil(totalSubscriptionPlans / size);

    return {
      subscriptionPlans,
      currentPage: page,
      totalPages,
    };
  }

  public async getSubscriptionPlanById(subscriptionPlanId: string) {
    return await this._subscriptionPlanRepository.getSubscriptionPlanById(
      subscriptionPlanId
    );
  }

  public async editSubscriptionPlan(
    subscriptionPlanId: string,
    title: string,
    description: string,
    price: number,
    duration: number
  ): Promise<ISubscriptionPlan | null> {
    return this._subscriptionPlanRepository.updateById(subscriptionPlanId, {
      title,
      description,
      price,
      duration,
    });
  }
}

export default SubscriptionPlanService;
