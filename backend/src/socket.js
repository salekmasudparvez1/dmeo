import { Server } from "socket.io";

let io;

export function initSocket(server, corsOrigin) {
  io = new Server(server, {
    cors: {
      origin: corsOrigin || "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket not initialized");
  return io;
}