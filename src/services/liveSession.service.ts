import {
  AccessToken,
  EncodingOptionsPreset,
  SegmentedFileOutput,
} from "livekit-server-sdk";
import envConfig from "../config/env";
import { ILiveSessionRepository } from "../interfaces/repositories/ILiveSession.repository";
import { ILiveSession } from "../models/LiveSession.model";
import { getObjectId } from "../utils/objectId";
import { ILiveSessionService } from "./../interfaces/services/ILiveSession.service";
import { ICourseRepository } from "../interfaces/repositories/ICourse.repository";
import { egressClient } from "../config/liveKit";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { io } from "..";
import { SocketEvents } from "../constants/socketEvents";

class LiveSessionService implements ILiveSessionService {
  constructor(
    private _liveSessionRepository: ILiveSessionRepository,
    private _courseRepository: ICourseRepository,
    private _userRepository: IUserRepository
  ) {}

  public async scheduleLiveSession(
    courseId: string,
    title: string,
    description: string,
    date: Date,
    time: string
  ): Promise<ILiveSession> {
    return await this._liveSessionRepository.create({
      courseId: getObjectId(courseId),
      title,
      description,
      date,
      time,
      status: "upcoming",
    });
  }

  public async getLiveSessionsByCourseId(
    courseId: string
  ): Promise<ILiveSession[]> {
    return await this._liveSessionRepository.getLiveSessionsByCourseId(
      courseId
    );
  }

  public async editLiveSession(
    liveSessionId: string,
    data: Partial<ILiveSession>
  ): Promise<ILiveSession | null> {
    return await this._liveSessionRepository.updateById(liveSessionId, data);
  }

  public async deleteLiveSession(liveSessionId: string): Promise<void> {
    await this._liveSessionRepository.deleteById(liveSessionId);
  }

  public async trainerViewStartLiveSession(
    liveSessionId: string
  ): Promise<{ liveSession: ILiveSession; token?: string } | null> {
    let token: undefined | string;
    const liveSession = await this._liveSessionRepository.findById(
      liveSessionId
    );

    if (!liveSession) return null;

    const course = await this._courseRepository.findById(
      liveSession.courseId.toString()
    );

    if (liveSession.status === "upcoming") {
      const at = new AccessToken(
        envConfig.LIVEKIT_API_KEY,
        envConfig.LIVEKIT_API_SECRET,
        {
          identity: course?.trainerId! as unknown as string,
          name: "host",
          ttl: "10m",
        }
      );

      at.addGrant({
        roomJoin: true,
        room: liveSession._id as string,
        canPublish: true,
        canSubscribe: true,
        roomAdmin: true,
        roomCreate: true,
      });

      token = await at.toJwt();
      await this._liveSessionRepository.startLiveSession(liveSessionId);
      await this._liveSessionRepository.addUserToLiveSession(
        liveSessionId,
        String(course?.trainerId!)
      );
    }

    return { liveSession, token };
  }

  public async startRecording(roomId: string): Promise<void> {
    const folderName = `recordings/${roomId}`;
    const playlistName = `${roomId}.m3u8`;
    const livePlaylistName = `${roomId}-live.m3u8`;
    const recordedSrc = `${envConfig.AWS_BUCKET_URL}/${folderName}/${roomId}.m3u8`;
    const liveSrc = `${envConfig.AWS_BUCKET_URL}/${folderName}/${roomId}-live.m3u8`;

    const outputs = {
      segments: new SegmentedFileOutput({
        filenamePrefix: `${folderName}/session`,
        playlistName: playlistName,
        livePlaylistName: livePlaylistName,
        segmentDuration: 2,
        output: {
          case: "s3",
          value: {
            accessKey: envConfig.AWS_ACCESS_KEY_ID,
            secret: envConfig.AWS_SECRET_ACCESS_KEY,
            bucket: envConfig.AWS_BUCKET_NAME,
            endpoint: envConfig.AWS_ENDPOINT,
            region: envConfig.AWS_REGION,
            forcePathStyle: true,
          },
        },
      }),
    };

    const egressInfo = await egressClient.startRoomCompositeEgress(
      roomId,
      outputs,
      {
        layout: "screen-share",
        encodingOptions: EncodingOptionsPreset.H264_1080P_30,
        audioOnly: false,
      }
    );

    await this._liveSessionRepository.startRecording(
      roomId,
      egressInfo.egressId,
      liveSrc,
      recordedSrc
    );
  }

  public async endLiveSession(roomId: string): Promise<void> {
    const egressId = await this._liveSessionRepository.endLiveSession(roomId);
    await egressClient.stopEgress(egressId);
  }

  public async userJoinLiveSession(
    liveSessionId: string,
    userId: string
  ): Promise<void> {
    await this._liveSessionRepository.addUserToLiveSession(
      liveSessionId,
      userId
    );
  }

  public async liveChat(
    liveSessionId: string,
    userId: string,
    message: string
  ): Promise<void> {
    console.log(message);
    const user = await this._userRepository.findById(userId);
    if (!user) return;
    const liveMembers = await this._liveSessionRepository.getLiveSessionUsers(
      liveSessionId
    );
    console.log(liveMembers);
    if (!liveMembers) return;
    io.to(liveMembers).emit(SocketEvents.LIVE_CHAT_MESSAGE_BROADCAST, {
      userId,
      message,
      username: user.username,
      profileImage: user.profileImage,
    });
  }
}

export default LiveSessionService;
