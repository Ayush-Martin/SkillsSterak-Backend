import { IStream } from "../../models/Stream.model";

export interface IStreamService {
  viewStream(
    userId: string,
    streamId: string
  ): Promise<{ stream: IStream; token: string } | void>;
  getStreams(
    search: string,
    page: number,
    size: number
  ): Promise<{
    liveStreams: IStream[];
    currentPage: number;
    totalPages: number;
  }>;
  endStream(roomId: string): Promise<void>;
  startStream(
    hostId: string,
    title: string,
    description: string,
    thumbnail: string
  ): Promise<{ stream: IStream; token: string }>;
  liveChat(roomId: string, userId: string, message: string): Promise<void>;
  //   getStream(roomId: string): Promise<any>;
  //   updateStream(roomId: string, stream: any): Promise<any>;
  //   deleteStream(roomId: string): Promise<any>;
}
