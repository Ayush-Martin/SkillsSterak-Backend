import { Model } from "mongoose";
import { ITransactionRepository } from "../interfaces/repositories/ITransaction.repository";
import { ITransaction } from "../models/Transaction.model";
import BaseRepository from "./Base.repository";

class TransactionRepository
  extends BaseRepository<ITransaction>
  implements ITransactionRepository
{
  constructor(private Transaction: Model<ITransaction>) {
    super(Transaction);
  }

  public async getUserTransactions(
    userId: string,
    skip: number,
    limit: number
  ): Promise<Array<ITransaction>> {
    return await this.Transaction.find({
      $or: [{ payerId: userId }, { receiverId: userId }],
    })
      .skip(skip)
      .limit(limit)
      .populate("payerId", "email _id role")
      .populate("receiverId", "email _id role")
      .populate("courseId", "title _id");
  }

  public async getUserTransactionCount(userId: string): Promise<number> {
    return await this.Transaction.countDocuments({
      $or: [{ payerId: userId }, { receiverId: userId }],
    });
  }

  public async getTransactions(
    skip: number,
    limit: number
  ): Promise<Array<ITransaction>> {
    return await this.Transaction.find()
      .skip(skip)
      .limit(limit)
      .populate("payerId", "email _id role")
      .populate("receiverId", "email _id role")
      .populate("courseId", "title _id");
  }

  public async getTransactionCount(): Promise<number> {
    return await this.Transaction.countDocuments();
  }
}

export default TransactionRepository;
