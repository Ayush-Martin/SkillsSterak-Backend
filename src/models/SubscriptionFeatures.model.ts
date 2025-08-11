import { Document, model, Schema } from "mongoose";
import {
  ISubscriptionFeatureId,
  SUBSCRIPTION_FEATURE_IDS,
} from "../constants/general";

export interface ISubscriptionFeature extends Document {
  featureId: ISubscriptionFeatureId;
  title: string;
}

const SubscriptionFeatureSchema = new Schema<ISubscriptionFeature>({
  featureId: {
    type: String,
    enum: Object.values(SUBSCRIPTION_FEATURE_IDS),
    required: true,
  },
  title: { type: String, required: true },
});

const SubscriptionFeatureModel = model<ISubscriptionFeature>(
  "SubscriptionFeature",
  SubscriptionFeatureSchema
);

export default SubscriptionFeatureModel;
