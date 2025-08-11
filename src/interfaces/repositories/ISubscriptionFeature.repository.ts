import { ISubscriptionFeatureId } from "../../constants/general";
import { ISubscriptionFeature } from "../../models/SubscriptionFeatures.model";

export interface ISubscriptionFeatureRepository {
  getSubscriptionFeatureByFeatureId(
    featureId: ISubscriptionFeatureId
  ): Promise<ISubscriptionFeature | null>;
  getAllSubscriptionFeatures(): Promise<ISubscriptionFeature[]>;
}
