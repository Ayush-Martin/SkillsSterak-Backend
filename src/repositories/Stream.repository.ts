import { Model } from "mongoose";
import { IStreamRepository } from "../interfaces/repositories/IStream.repository";
import { IStream } from "../models/Stream.model";
import BaseRepository from "./Base.repository";

class StreamRepository
  extends BaseRepository<IStream>
  implements IStreamRepository
{
  constructor(private Stream: Model<IStream>) {
    super(Stream);
  }

  public async getStreams(
    search: RegExp,
    skip: number,
    limit: number
  ): Promise<IStream[]> {
    console.log(await this.Stream.find({ title: search }), skip, limit);
    return await this.Stream.find({ title: search, isLive: true })
      .skip(skip)
      .limit(limit);
  }

  public async getStreamsCount(search: RegExp): Promise<number> {
    return await this.Stream.countDocuments({ title: search, isLive: true });
  }

  public async endStream(roomId: string): Promise<void> {
    await this.Stream.updateOne({ roomId }, { isLive: false });
  }
}

export default StreamRepository;
