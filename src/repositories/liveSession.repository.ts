import { Model } from "mongoose";
import { ILiveSessionRepository } from "../interfaces/repositories/ILiveSession.repository";
import { ILiveSession } from "../models/LiveSession.model";
import BaseRepository from "./Base.repository";
import { redisClient } from "../config/DB/redis";

class LiveSessionRepository
  extends BaseRepository<ILiveSession>
  implements ILiveSessionRepository
{
  constructor(private _LiveSession: Model<ILiveSession>) {
    super(_LiveSession);
  }

  public async getLiveSessionsByCourseId(
    courseId: string
  ): Promise<ILiveSession[]> {
    return await this._LiveSession.find(
      { courseId },
      {
        _id: 1,
        title: 1,
        description: 1,
        date: 1,
        time: 1,
        status: 1,
        liveSrc: 1,
        recordedSrc: 1,
      }
    );
  }

  public async startRecording(
    roomId: string,
    egressId: string,
    liveSrc: string,
    recordedSrc: string
  ): Promise<void> {
    await redisClient.set(`liveSession:room:${roomId}`, egressId);

    await this._LiveSession.updateOne(
      { _id: roomId },
      { liveSrc, recordedSrc, status: "live" }
    );
  }

  public async endLiveSession(roomId: string): Promise<string> {
    await this._LiveSession.updateOne({ _id: roomId }, { status: "completed" });

    return (await redisClient.get(`liveSession:room:${roomId}`))!;
  }

  public async startLiveSession(liveSessionId: string): Promise<void> {
    await this._LiveSession.updateOne(
      { _id: liveSessionId },
      { status: "live" }
    );
  }

  public async getLiveSessionUsers(
    liveSessionId: string
  ): Promise<string[] | null> {
    const data = await redisClient.get(`liveSession:${liveSessionId}`);
    if (!data) return null;
    const users: string[] = JSON.parse(data);
    return users;
  }

  public async addUserToLiveSession(
    liveSessionId: string,
    userId: string
  ): Promise<void> {
    const previous = (await this.getLiveSessionUsers(liveSessionId)) || [];
    await redisClient.set(
      `liveSession:${liveSessionId}`,
      JSON.stringify([...previous, userId])
    );
  }
}

export default LiveSessionRepository;
