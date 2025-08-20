import { Server } from "socket.io";

let io: Server;

export const initIo = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  return io;
};

export const getIo = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
