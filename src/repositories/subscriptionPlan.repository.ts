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
}

export default SubscriptionPlanRepository;
