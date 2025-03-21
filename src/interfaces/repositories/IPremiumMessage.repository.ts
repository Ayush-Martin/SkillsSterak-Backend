import { IPremiumMessage } from "../../models/PremiumMessage.model";
import { IBaseRepository } from "./IBase.repository";

export interface IPremiumMessageRepository
  extends IBaseRepository<IPremiumMessage> {
  getMessages(chatId: string): Promise<Array<IPremiumMessage>>;
}
