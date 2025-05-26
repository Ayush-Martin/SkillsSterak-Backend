import { IStream } from "../../models/Stream.model";
import { IBaseRepository } from "./IBase.repository";

export interface IStreamRepository extends IBaseRepository<IStream> {
  initializeStreamRoom(roomId: string, hostId: string): Promise<void>;
  getRoomUsers(roomId: string): Promise<string[] | null>;
  addUserToRoom(roomId: string, userId: string): Promise<void>;
  getStreams(courseId: string): Promise<IStream[]>;
  // getStreamsCount(search: RegExp): Promise<number>;
  endStream(roomId: string): Promise<void>;
  startRecording(
    roomId: string,
    egressId: string,
    recordedSrc: string,
    liveSrc: string
  ): Promise<void>;
  getEgressId(roomId: string): Promise<string | null>;
  //   createStream: (stream: IStream) => Promise<IStream>;
  //   findStream: (roomId: string) => Promise<IStream | null>;
  //   updateStream: (roomId: string, stream: IStream) => Promise<IStream | null>;
  //   deleteStream: (roomId: string) => Promise<IStream | null>;b
}
