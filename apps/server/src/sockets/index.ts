import { Server, Socket } from 'socket.io';
import { userSockets } from '../utils';
import { authMiddleware } from './auth';
import { AuthenticatedSocket } from '../types';
import prisma from '@meta/db';

export const setupSockets = (io: Server) => {
  io.use(authMiddleware);

  io.on('connection', (socket: AuthenticatedSocket) => {
    if (!socket.userId) return socket.disconnect();

    userSockets.set(socket.userId, socket.id);
    console.log(`User ${socket.userId} connected with socket ${socket.id}`);

    socket.on('sendMessage', async (payload: { toUserId: string; content: string }) => {
      console.log("payload:", payload)
      const { toUserId, content } = payload;
      const senderId = socket.userId;
      console.log(senderId)

      if (!senderId || !toUserId || !content) {
        console.log(senderId, toUserId, content)
        console.log("inside")
        return
      } 
      console.log("ooooooooooooooo")
      try {
        const message = await prisma.message.create({
          data: {
            senderId,
            receiverId: toUserId,
            content,
          },
        });

        const receiverSocketId = userSockets.get(toUserId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('newMessage', message);
        }

        socket.emit('messageSent', message);
      } catch (err) {
        console.error('Error saving message:', err);
        socket.emit('error', 'Failed to send message');
      }
    });

    socket.on('typing', (toUserId: string) => {
      const receiverSocketId = userSockets.get(toUserId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('userTyping', socket.userId);
      }
    });

    socket.on('disconnect', () => {
      userSockets.delete(socket.userId!);
      console.log(`User ${socket.userId} disconnected`);
    });
  });
};