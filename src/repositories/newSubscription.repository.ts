import { INewSubscriptionRepository } from "../interfaces/repositories/INewSubscription.repository";
import { INewSubscription } from "../models/NewSubscription.model";
import BaseRepository from "./Base.repository";

class NewSubscriptionRepository
  extends BaseRepository<INewSubscription>
  implements INewSubscriptionRepository
{
  constructor() {
    super(NewSubscription);
  }
}

export default NewSubscriptionRepository;
