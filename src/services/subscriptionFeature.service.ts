import { ISubscriptionFeatureRepository } from "../interfaces/repositories/ISubscriptionFeature.repository";
import { ISubscriptionFeatureService } from "../interfaces/services/ISubscriptionFeature.service";
import { ISubscriptionFeature } from "../models/SubscriptionFeatures.model";

class SubscriptionFeatureService implements ISubscriptionFeatureService {
  constructor(
    private _subscriptionFeatureRepository: ISubscriptionFeatureRepository
  ) {}

  public async getAllSubscriptionFeatures(): Promise<ISubscriptionFeature[]> {
    return await this._subscriptionFeatureRepository.getAllSubscriptionFeatures();
  }
}

export default SubscriptionFeatureService;
