import { Model } from "mongoose";
import { ISubscriptionFeatureRepository } from "../interfaces/repositories/ISubscriptionFeature.repository";
import { ISubscriptionFeature } from "../models/SubscriptionFeatures.model";
import { ISubscriptionFeatureId } from "../constants/general";

class SubscriptionFeatureRepository implements ISubscriptionFeatureRepository {
  constructor(private _SubscriptionFeature: Model<ISubscriptionFeature>) {}

  public async getSubscriptionFeatureByFeatureId(
    featureId: ISubscriptionFeatureId
  ): Promise<ISubscriptionFeature | null> {
    return await this._SubscriptionFeature.findOne({ featureId });
  }

  public async getAllSubscriptionFeatures(): Promise<ISubscriptionFeature[]> {
    return await this._SubscriptionFeature.find();
  }
}

export default SubscriptionFeatureRepository;
