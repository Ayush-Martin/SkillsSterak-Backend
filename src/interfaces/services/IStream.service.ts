import { IStream } from "../../models/Stream.model";

export interface IStreamService {
  /** Allows a user to view a stream and returns stream info and token. */
  viewStream(
    userId: string,
    streamId: string
  ): Promise<{ stream: IStream; token: string } | void>;
  /** Retrieves all streams for a course. */
  getStreams(courseId: string): Promise<IStream[]>;
  /** Ends a stream by room ID. */
  endStream(roomId: string): Promise<void>;
  /** Starts a new stream and returns stream info and token. */
  startStream(
    hostId: string,
    title: string,
    description: string,
    thumbnail: string,
    courseId: string
  ): Promise<{ stream: IStream; token: string }>;
  /** Sends a live chat message in a stream room. */
  liveChat(roomId: string, userId: string, message: string): Promise<void>;
  /** Starts recording a stream. */
  startRecording(roomId: string): Promise<void>;
  /** Stops recording a stream. */
  stopRecording(roomId: string): Promise<void>;
}
