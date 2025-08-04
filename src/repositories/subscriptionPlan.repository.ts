import { Model } from "mongoose";
import { ISubscriptionPlanRepository } from "../interfaces/repositories/ISubscriptionPlan.repository";
import { ISubscriptionPlan } from "../models/SubscriptionPlan.model";
import BaseRepository from "./Base.repository";

class SubscriptionPlanRepository
  extends BaseRepository<ISubscriptionPlan>
  implements ISubscriptionPlanRepository
{
  constructor(private _SubscriptionPlan: Model<ISubscriptionPlan>) {
    super(_SubscriptionPlan);
  }

  public async changeListingStatus(
    id: string,
    isListed: boolean
  ): Promise<void> {
    await this._SubscriptionPlan.updateOne({ _id: id }, { isListed });
  }

  public async getSubscriptionPlansCount(): Promise<number> {
    return await this._SubscriptionPlan.countDocuments();
  }

  public async getSubscriptionPlans(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<ISubscriptionPlan[]> {
    return await this._SubscriptionPlan
      .find({ title: search })
      .skip(skip)
      .limit(limit);
  }

  public async getSubscriptionPlanById(
    id: string
  ): Promise<ISubscriptionPlan | null> {
    return await this._SubscriptionPlan.findById(id);
  }

  public async getAllListedSubscriptionPlans(): Promise<ISubscriptionPlan[]> {
    return await this._SubscriptionPlan.find({ isListed: true });
  }
}

export default SubscriptionPlanRepository;
