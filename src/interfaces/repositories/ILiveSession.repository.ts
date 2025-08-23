import { ILiveSession } from "../../models/LiveSession.model";
import { IBaseRepository } from "./IBase.repository";

export interface ILiveSessionRepository extends IBaseRepository<ILiveSession> {
  getLiveSessionsByCourseId(courseId: string): Promise<ILiveSession[]>;
  startRecording(
    roomId: string,
    egressId: string,
    liveSrc: string,
    recordedSrc: string
  ): Promise<void>;
  endLiveSession(roomId: string): Promise<string>;
  startLiveSession(liveSessionId: string): Promise<void>;
  addUserToLiveSession(
    liveSessionId: string,
    userId: string,
  ): Promise<void>;
  getLiveSessionUsers(
    liveSessionId: string
  ): Promise<string[] | null>;
}
