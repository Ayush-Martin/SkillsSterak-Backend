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

  public async getStreams(courseId: string): Promise<IStream[]> {
    return await this.Stream.find({ courseId });
  }

  public async getStreamsCount(search: RegExp): Promise<number> {
    return await this.Stream.countDocuments({ title: search, isLive: true });
  }

  public async getRoomUsers(roomId: string): Promise<string[] | null> {
    const storedData = await redisClient.get(`stream:room:${roomId}`);
    if (!storedData) return null;
    return JSON.parse(storedData).users;
  }

  public async endStream(roomId: string): Promise<void> {
    await this.Stream.updateOne({ roomId }, { isLive: false });
  }

  public async initializeStreamRoom(
    roomId: string,
    hostId: string
  ): Promise<void> {
    await redisClient.set(
      `stream:room:${roomId}`,
      JSON.stringify({ users: [hostId], egressId: null })
    );
  }

  public async startRecording(
    roomId: string,
    egressId: string,
    recordedSrc: string,
    liveSrc: string
  ): Promise<void> {
    const storedData = await redisClient.get(`stream:room:${roomId}`);
    if (!storedData) return;
    const data = JSON.parse(storedData);

    await redisClient.set(
      `stream:room:${roomId}`,
      JSON.stringify({ ...data, egressId })
    );

    await this.Stream.updateOne(
      { roomId },
      { isLive: true, recordedSrc, liveSrc }
    );
  }

  public async getEgressId(roomId: string): Promise<string | null> {
    const storedData = await redisClient.get(`stream:room:${roomId}`);
    if (!storedData) return null;
    const { egressId } = JSON.parse(storedData);
    return egressId;
  }

  public async addUserToRoom(roomId: string, userId: string): Promise<void> {
    const storedData = await redisClient.get(`stream:room:${roomId}`);
    if (!storedData) return;
    const data = JSON.parse(storedData);

    await redisClient.set(
      `stream:room:${roomId}`,
      JSON.stringify({ ...data, users: [...data.users, userId] })
    );
  }
}

export default StreamRepository;
