import { IStream } from "../../models/Stream.model";

export interface IStreamService {
  viewStream(userId: string, streamId: string): Promise<string>;
  getStreams(
    search: string,
    page: number
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
  ): Promise<string>;
  //   getStream(roomId: string): Promise<any>;
  //   updateStream(roomId: string, stream: any): Promise<any>;
  //   deleteStream(roomId: string): Promise<any>;
}
