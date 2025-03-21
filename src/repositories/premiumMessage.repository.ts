import { Model } from "mongoose";
import { IPremiumMessageRepository } from "../interfaces/repositories/IPremiumMessage.repository";
import { IPremiumMessage } from "../models/PremiumMessage.model";
import BaseRepository from "./Base.repository";

class PremiumMessageRepository
  extends BaseRepository<IPremiumMessage>
  implements IPremiumMessageRepository
{
  constructor(private PremiumMessage: Model<IPremiumMessage>) {
    super(PremiumMessage);
  }

  public async getMessages(chatId: string): Promise<Array<IPremiumMessage>> {
    return await this.PremiumMessage.find({ chatId });
  }
}

export default PremiumMessageRepository;
