import { IStream } from "../../models/Stream.model";
import { IBaseRepository } from "./IBase.repository";

export interface IStreamRepository extends IBaseRepository<IStream> {
  getStreams(search: RegExp, skip: number, limit: number): Promise<IStream[]>;
  getStreamsCount(search: RegExp): Promise<number>;
  endStream(roomId: string): Promise<void>;
  //   createStream: (stream: IStream) => Promise<IStream>;
  //   findStream: (roomId: string) => Promise<IStream | null>;
  //   updateStream: (roomId: string, stream: IStream) => Promise<IStream | null>;
  //   deleteStream: (roomId: string) => Promise<IStream | null>;b
}
