import envConfig from "../config/env";
import { RECORDS_PER_PAGE } from "../constants/general";
import { StatusCodes } from "../constants/statusCodes";
import { IStreamRepository } from "../interfaces/repositories/IStream.repository";
import { IStreamService } from "../interfaces/services/IStream.service";
import { IStream } from "../models/Stream.model";
import errorCreator from "../utils/customError";
import { getObjectId } from "../utils/objectId";
import { AccessToken } from "livekit-server-sdk";

const generateRoomId = (title: string) => {
  const date = new Date().getTime();
  const cleanedTitle = title.replace(/\s+/g, "").toLowerCase();
  const randomPart = Math.random().toString(36).substring(2, 6);
  return `${cleanedTitle}-${date}-${randomPart}`;
};

class StreamService implements IStreamService {
  constructor(private streamRepository: IStreamRepository) {}

  public async startStream(
    hostId: string,
    title: string,
    description: string,
    thumbnail: string
  ): Promise<string> {
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

    return await at.toJwt();
  }

  public async endStream(roomId: string): Promise<void> {
    await this.streamRepository.endStream(roomId);
  }

  public async viewStream(userId: string, streamId: string): Promise<string> {
    const stream = await this.streamRepository.findById(streamId);
    if (!stream) {
      errorCreator("Stream not found", StatusCodes.NOT_FOUND);
      return "";
    }

    console.log(stream);

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

    return await at.toJwt();
  }

  public async getStreams(
    search: string,
    page: number
  ): Promise<{
    liveStreams: IStream[];
    currentPage: number;
    totalPages: number;
  }> {
    const searchRegex = new RegExp(search, "i");
    const skip = (page - 1) * RECORDS_PER_PAGE;
    const liveStreams = await this.streamRepository.getStreams(
      searchRegex,
      skip,
      RECORDS_PER_PAGE
    );

    const totalStreams = await this.streamRepository.getStreamsCount(
      searchRegex
    );
    const totalPages = Math.ceil(totalStreams / RECORDS_PER_PAGE);
    return {
      liveStreams,
      currentPage: page,
      totalPages,
    };
  }
}

export default StreamService;
