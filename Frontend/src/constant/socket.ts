import { io, Socket } from "socket.io-client";

const BaseUrl = 'http://localhost:3000';
let socket: Socket;

export const CreatesocketConnection = (): Socket => {
  
  if (!socket) {
    socket = io(BaseUrl);
  }
  return socket;
};
