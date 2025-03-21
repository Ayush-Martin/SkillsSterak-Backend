import { IPremiumChat } from "../../models/PremiumChat.model";
import { IBaseRepository } from "./IBase.repository";

export interface IPremiumChatRepository extends IBaseRepository<IPremiumChat> {
  checkUserHadChat(userId: string, trainerId: string): Promise<boolean>;
  getTrainerChats(trainerId: string): Promise<Array<IPremiumChat>>;
  getUserChats(userId: string): Promise<Array<IPremiumChat>>;
}
