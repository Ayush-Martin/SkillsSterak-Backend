import { IStream } from "../../models/Stream.model";
import { IBaseRepository } from "./IBase.repository";

export interface IStreamRepository extends IBaseRepository<IStream> {
  /** Initialize a stream room with a unique ID and host */
  initializeStreamRoom(roomId: string, hostId: string): Promise<void>;
  /** Get all users in a stream room */
  getRoomUsers(roomId: string): Promise<string[] | null>;
  /** Add a user to a stream room */
  addUserToRoom(roomId: string, userId: string): Promise<void>;
  /** Get all streams for a course */
  getStreams(courseId: string): Promise<IStream[]>;
  /** End a stream by room ID */
  endStream(roomId: string): Promise<void>;
  /** Start recording a stream */
  startRecording(
    roomId: string,
    egressId: string,
    recordedSrc: string,
    liveSrc: string
  ): Promise<void>;
  /** Get the egress ID for a stream room */
  getEgressId(roomId: string): Promise<string | null>;
}
