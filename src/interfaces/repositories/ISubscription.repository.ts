import { ISubscription } from "../../models/Subscription.model";
import BaseRepository from "../../repositories/Base.repository";

export interface ISubscriptionRepository
  extends BaseRepository<ISubscription> {}
