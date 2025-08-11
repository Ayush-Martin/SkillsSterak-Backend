import { ISubscriptionFeature } from "../../models/SubscriptionFeatures.model";

export interface ISubscriptionFeatureService {
  getAllSubscriptionFeatures(): Promise<ISubscriptionFeature[]>;
}
