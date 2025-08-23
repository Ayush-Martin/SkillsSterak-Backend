import { Socket } from "socket.io";

export interface ISocketService {
  socketConnectionHandler(socket: Socket, userId: string): Promise<void>;
}
