import { Socket } from "socket.io";

export interface ISocketService {
  /**
   * Initializes and manages a user's socket connection. Used to enable real-time features and maintain user presence.
   */
  socketConnectionHandler(socket: Socket, userId: string): Promise<void>;
}
