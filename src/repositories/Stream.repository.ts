import { Model } from "mongoose";
import { IStreamRepository } from "../interfaces/repositories/IStream.repository";
import { IStream } from "../models/Stream.model";
import BaseRepository from "./Base.repository";
import { redisClient } from "../config/DB/redis";

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
    return await this.Stream.find({ title: search, isLive: true })
      .skip(skip)
      .limit(limit);
  }

  public async getStreamsCount(search: RegExp): Promise<number> {
    return await this.Stream.countDocuments({ title: search, isLive: true });
  }

  public async getRoomUsers(roomId: string): Promise<string[] | null> {
    const storedData = await redisClient.get(`stream:room:${roomId}`);
    if (!storedData) return null;
    return JSON.parse(storedData);
  }

  public async endStream(roomId: string): Promise<void> {
    await this.Stream.updateOne({ roomId }, { isLive: false });
  }

  public async initializeStreamRoom(
    roomId: string,
    hostId: string
  ): Promise<void> {
    await redisClient.set(`stream:room:${roomId}`, JSON.stringify([hostId]));
  }

  public async addUserToRoom(roomId: string, userId: string): Promise<void> {
    const storedData = await redisClient.get(`stream:room:${roomId}`);
    if (!storedData) return;

    await redisClient.set(
      `stream:room:${roomId}`,
      JSON.stringify([...JSON.parse(storedData), userId])
    );
  }
}

export default StreamRepository;
