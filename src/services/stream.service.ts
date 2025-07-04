import { io } from "..";
import envConfig from "../config/env";
import { egressClient } from "../config/liveKit";
import { LiveStreamMessage, UserMessage } from "../constants/responseMessages";
import { SocketEvents } from "../constants/socketEvents";
import { StatusCodes } from "../constants/statusCodes";
import { IStreamRepository } from "../interfaces/repositories/IStream.repository";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { IStreamService } from "../interfaces/services/IStream.service";
import { IStream } from "../models/Stream.model";
import errorCreator from "../utils/customError";
import { getObjectId } from "../utils/objectId";
import {
  AccessToken,
  EncodingOptionsPreset,
  SegmentedFileOutput,
} from "livekit-server-sdk";

const generateRoomId = (title: string) => {
  const date = new Date().getTime();
  const cleanedTitle = title.replace(/\s+/g, "").toLowerCase();
  const randomPart = Math.random().toString(36).substring(2, 6);
  return `${cleanedTitle}-${date}-${randomPart}`;
};

class StreamService implements IStreamService {
  constructor(
    private streamRepository: IStreamRepository,
    private userRepository: IUserRepository
  ) {}

  public async startStream(
    hostId: string,
    title: string,
    description: string,
    thumbnail: string,
    courseId: string
  ): Promise<{ stream: IStream; token: string }> {
    const roomId = generateRoomId(title);

    const stream = await this.streamRepository.create({
      hostId: getObjectId(hostId),
      roomId,
      title,
      description,
      thumbnail,
      isLive: true,
      courseId: getObjectId(courseId),
    });

    const at = new AccessToken(
      envConfig.LIVEKIT_API_KEY,
      envConfig.LIVEKIT_API_SECRET,
      {
        identity: hostId,
        name: "host",
        ttl: "10m",
      }
    );

    at.addGrant({
      roomJoin: true,
      room: stream.roomId,
      canPublish: true,
      canSubscribe: true,
      roomAdmin: true,
      roomCreate: true,
    });

    await this.streamRepository.initializeStreamRoom(stream.roomId, hostId);
    return { stream: stream, token: await at.toJwt() };
  }

  public async endStream(roomId: string): Promise<void> {
    await this.streamRepository.endStream(roomId);
    const egressId = await this.streamRepository.getEgressId(roomId);
    if (!egressId) {
      errorCreator(LiveStreamMessage.RecordingNotFound, StatusCodes.NOT_FOUND);
      return;
    }

    await egressClient.stopEgress(egressId);
  }

  public async viewStream(
    userId: string,
    streamId: string
  ): Promise<{ stream: IStream; token: string } | void> {
    const stream = await this.streamRepository.findById(streamId);
    if (!stream) {
      errorCreator(LiveStreamMessage.StreamNotFound, StatusCodes.NOT_FOUND);
      return;
    }

    const at = new AccessToken(
      envConfig.LIVEKIT_API_KEY,
      envConfig.LIVEKIT_API_SECRET,
      {
        identity: userId,
        name: "user",
        ttl: "10m",
      }
    );

    at.addGrant({
      roomJoin: true,
      room: stream.roomId,
      canPublish: false,
      canSubscribe: true,
    });

    await this.streamRepository.addUserToRoom(stream.roomId, userId);

    return { stream: stream, token: await at.toJwt() };
  }

  public async getStreams(courseId: string): Promise<IStream[]> {
    const streams = await this.streamRepository.getStreams(courseId);
    return streams;
  }

  public async liveChat(
    roomId: string,
    userId: string,
    message: string
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      errorCreator(UserMessage.UserNotFound, StatusCodes.NOT_FOUND);
      return;
    }

    const users = await this.streamRepository.getRoomUsers(roomId);

    if (!users) {
      errorCreator(LiveStreamMessage.StreamNotFound, StatusCodes.NOT_FOUND);
      return;
    }

    const { username, profileImage, _id } = user;
    io.to(users).emit(SocketEvents.LIVE_CHAT_NEW_MESSAGE, {
      user: {
        username,
        profileImage,
        _id,
      },
      message,
    });
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
        layout: "grid",
        encodingOptions: EncodingOptionsPreset.H264_1080P_30,
        audioOnly: false,
      }
    );

    await this.streamRepository.startRecording(
      roomId,
      egressInfo.egressId,
      recordedSrc,
      liveSrc
    );
  }

}

export default StreamService;
