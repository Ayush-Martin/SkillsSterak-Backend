import { IStream } from "../../models/Stream.model";

export interface IStreamService {
  /**
   * Grants a user access to view a stream, returning stream details and an access token. Used to enforce access control and enable secure viewing.
   */
  viewStream(
    userId: string,
    streamId: string
  ): Promise<{ stream: IStream; token: string } | void>;

  /**
   * Retrieves all streams associated with a course. Used to display available live or recorded sessions for a course.
   */
  getStreams(courseId: string): Promise<IStream[]>;

  /**
   * Ends a live stream by its room identifier. Used to manage stream lifecycle and free up resources.
   */
  endStream(roomId: string): Promise<void>;

  /**
   * Starts a new live stream, returning stream details and an access token. Used by hosts to initiate live sessions.
   */
  startStream(
    hostId: string,
    title: string,
    description: string,
    thumbnail: string,
    courseId: string
  ): Promise<{ stream: IStream; token: string }>;

  /**
   * Sends a live chat message in a stream room. Used to enable real-time interaction between viewers and hosts.
   */
  liveChat(roomId: string, userId: string, message: string): Promise<void>;

  /**
   * Initiates recording of a live stream. Used to archive sessions for later viewing or compliance.
   */
  startRecording(roomId: string): Promise<void>;
}
