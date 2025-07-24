import { ILiveSession } from "../../models/LiveSession.model";

export interface ILiveSessionService {
  scheduleLiveSession(
    courseId: string,
    title: string,
    description: string,
    date: Date,
    time: string
  ): Promise<ILiveSession>;
  getLiveSessionsByCourseId(courseId: string): Promise<ILiveSession[]>;
  editLiveSession(
    liveSessionId: string,
    data: Partial<ILiveSession>
  ): Promise<ILiveSession | null>;
  deleteLiveSession(liveSessionId: string): Promise<void>;
  trainerViewStartLiveSession(
    liveSessionId: string
  ): Promise<{ liveSession: ILiveSession; token?: string } | null>;
  startRecording(roomId: string): Promise<void>;
  endLiveSession(roomId: string): Promise<void>;
}
