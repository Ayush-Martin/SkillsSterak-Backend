import { IStream } from "../../models/Stream.model";
import { IBaseRepository } from "./IBase.repository";

/**
 * Repository interface for stream-related data operations.
 * Supports live streaming, room management, and recording features.
 */
export interface IStreamRepository extends IBaseRepository<IStream> {
  /**
   * Initializes a new stream room with a unique ID and host.
   * Enables real-time collaboration and live session setup.
   */
  initializeStreamRoom(roomId: string, hostId: string): Promise<void>;

  /**
   * Retrieves all users currently in a stream room.
   * Supports participant management and live audience features.
   */
  getRoomUsers(roomId: string): Promise<string[] | null>;

  /**
   * Adds a user to a stream room.
   * Enables dynamic joining of live sessions.
   */
  addUserToRoom(roomId: string, userId: string): Promise<void>;

  /**
   * Retrieves all streams associated with a course.
   * Supports course content delivery and session history.
   */
  getStreams(courseId: string): Promise<IStream[]>;

  /**
   * Ends a stream session by its room ID.
   * Supports session lifecycle management and cleanup.
   */
  endStream(roomId: string): Promise<void>;

  /**
   * Starts recording a live stream session.
   * Enables content archiving and playback features.
   */
  startRecording(
    roomId: string,
    egressId: string,
    recordedSrc: string,
    liveSrc: string
  ): Promise<void>;

  /**
   * Retrieves the egress (recording) ID for a stream room.
   * Supports tracking and management of recorded sessions.
   */
  getEgressId(roomId: string): Promise<string | null>;
}
