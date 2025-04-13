import { io } from "..";
import envConfig from "../config/env";
import { RECORDS_PER_PAGE } from "../constants/general";
import { StatusCodes } from "../constants/statusCodes";
import { IStreamRepository } from "../interfaces/repositories/IStream.repository";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { IStreamService } from "../interfaces/services/IStream.service";
import { IStream } from "../models/Stream.model";
import errorCreator from "../utils/customError";
import { getObjectId } from "../utils/objectId";
import { AccessToken, RoomServiceClient } from "livekit-server-sdk";

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
    thumbnail: string
  ): Promise<{ stream: IStream; token: string }> {
    const roomId = generateRoomId(title);

    const stream = await this.streamRepository.create({
      hostId: getObjectId(hostId),
      roomId,
      title,
      description,
      thumbnail,
      isLive: true,
    });

    const at = new AccessToken(
      envConfig.LIVEKIT_API_KEY,
      envConfig.LIVEKIT_API_SECRET,
      {
        identity: hostId,
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
  }

  public async viewStream(
    userId: string,
    streamId: string
  ): Promise<{ stream: IStream; token: string } | void> {
    const stream = await this.streamRepository.findById(streamId);
    if (!stream) {
      errorCreator("Stream not found", StatusCodes.NOT_FOUND);
      return;
    }

    const at = new AccessToken(
      envConfig.LIVEKIT_API_KEY,
      envConfig.LIVEKIT_API_SECRET,
      {
        identity: userId,
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

  public async getStreams(
    search: string,
    page: number,
    size: number
  ): Promise<{
    liveStreams: IStream[];
    currentPage: number;
    totalPages: number;
  }> {
    const searchRegex = new RegExp(search, "i");
    const skip = (page - 1) * size;
    const liveStreams = await this.streamRepository.getStreams(
      searchRegex,
      skip,
      size
    );

    const totalStreams = await this.streamRepository.getStreamsCount(
      searchRegex
    );
    const totalPages = Math.ceil(totalStreams / size);

    console.log(totalStreams, size, totalPages);
    return {
      liveStreams,
      currentPage: page,
      totalPages,
    };
  }

  public async liveChat(
    roomId: string,
    userId: string,
    message: string
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      errorCreator("User not found", StatusCodes.NOT_FOUND);
      return;
    }

    const users = await this.streamRepository.getRoomUsers(roomId);

    if (!users) {
      errorCreator("Stream not found", StatusCodes.NOT_FOUND);
      return;
    }

    const { username, profileImage, _id } = user;
    io.to(users).emit("liveChat", {
      user: {
        username,
        profileImage,
        _id,
      },
      message,
    });
  }
}

export default StreamService;
