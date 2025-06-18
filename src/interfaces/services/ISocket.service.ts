import { Socket } from "socket.io";

export interface ISocketService {
  /** Handles socket connection for a user. */
  socketConnectionHandler(socket: Socket, userId: string): Promise<void>;
}
