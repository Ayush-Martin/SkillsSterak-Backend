import envConfig from "../config/env";
import { RECORDS_PER_PAGE } from "../constants/general";
import TrainerRequestController from "../controllers/trainerRequest.controller";
import { IStreamRepository } from "../interfaces/repositories/IStream.repository";
import { IStreamService } from "../interfaces/services/IStream.service";
import { IStream } from "../models/Stream.model";
import { getObjectId } from "../utils/objectId";
import { generateToken04 } from "../utils/zegoCloud";

const generateRoomId = (title: string) => {
  const date = new Date().getTime();
  const cleanedTitle = title.replace(/\s+/g, "").toLowerCase();
  const randomPart = Math.random().toString(36).substring(2, 6);
  return `${cleanedTitle}-${date}-${randomPart}`;
};

class StreamService implements IStreamService {
  constructor(private streamRepository: IStreamRepository) {}

  // public async getStreamToken(
  //   userId: string,
  //   roomId: string,
  //   role: "publisher" | "viewer"
  // ): Promise<string> {
  //   return generateToken({
  //     appId: envConfig.ZEGO_APP_ID,

  //   });
  // }

  public async createStream(
    hostId: string,
    roomId: string,
    title: string,
    description: string,
    thumbnail: string
  ) {
    return await this.streamRepository.create({
      hostId: getObjectId(hostId),
      roomId,
      title,
      isLive: true,
      description,
      thumbnail,
    });
  }

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

    console.log(hostId, typeof hostId);

    const token = generateToken04(
      envConfig.ZEGO_APP_ID,
      hostId.toString(),
      envConfig.ZEGO_SERVER_SECRET,
      24 * 60 * 60
    );

    return { stream, token };
  }

  public async endStream(roomId: string): Promise<void> {
    await this.streamRepository.endStream(roomId);
  }

  public async viewStream(userId: string, roomId: string): Promise<string> {
    const token = generateToken04(
      envConfig.ZEGO_APP_ID,
      userId.toString(),
      envConfig.ZEGO_SERVER_SECRET,
      24 * 60 * 60
    );

    return token;
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
