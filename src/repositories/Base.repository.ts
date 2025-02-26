import { Model } from "mongoose";
import { IBaseRepository } from "../interfaces/repositories/IBase.repository";

class BaseRepository<T> implements IBaseRepository<T> {
  constructor(private model: Model<T>) {}

  public async findAll(): Promise<Array<T>> {
    return await this.model.find();
  }

  public async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  public async updateById(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  public async create(data: Partial<T>): Promise<T> {
    const newDocument = new this.model(data);
    await newDocument.save();
    return newDocument;
  }

  public async deleteById(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id });
  }
}

export default BaseRepository;
