import { Server, Socket } from "socket.io";
import { userSockets } from "../utils/utils";
import { AuthenticatedSocket } from "../types";
import prisma from "@meta/db";
import { wsAuthMiddleware } from "../middleware/socketAuth.middleware";

export const setupSockets = (io: Server) => {
  io.use(wsAuthMiddleware);

  io.on("connection", async (socket: AuthenticatedSocket) => {
    if (!socket.userId) return socket.disconnect();

    userSockets.set(socket.userId, socket.id);
    console.log(`User ${socket.userId} connected with socket ${socket.id}`);
    console.log("Current userSockets:", Array.from(userSockets.entries()));

    io.emit("onlineUsers", Array.from(userSockets.keys()));

    socket.on("sendMessage", async (payload: { toUserId: string; content: string }) => {
      console.log("Received sendMessage:", payload);
      const { toUserId, content } = payload;
      const senderId = socket.userId;

      if (!senderId || !toUserId || !content) {
        console.log("Invalid payload:", { senderId, toUserId, content });
        socket.emit("error", "Invalid message payload");
        return;
      }

      try {
        const message = await prisma.message.create({
          data: {
            senderId,
            receiverId: toUserId,
            content,
          },
        });

        console.log("Message saved to DB:", message);
        const receiverSocketId = userSockets.get(toUserId);
        console.log(`Receiver socket ID for ${toUserId}: ${receiverSocketId}`);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", message);
          console.log(`Emitted newMessage to ${toUserId} (socket: ${receiverSocketId})`);
        } else {
          console.log(`No socket found for receiver ${toUserId}`);
        }

        socket.emit("messageSent", message);
        console.log(`Emitted messageSent to ${senderId} (socket: ${socket.id})`);
      } catch (err) {
        console.error("Error saving message:", err);
        socket.emit("error", "Failed to send message");
      }
    });

    socket.on("typing", (toUserId: string) => {
      const receiverSocketId = userSockets.get(toUserId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userTyping", socket.userId);
        console.log(`Emitted typing to ${toUserId}`);
      }
    });

    socket.on("disconnect", () => {
      userSockets.delete(socket.userId!);
      console.log(`User ${socket.userId} disconnected`);
      console.log("Current userSockets:", Array.from(userSockets.entries()));
      io.emit("onlineUsers", Array.from(userSockets.keys()));
    });
  });
};