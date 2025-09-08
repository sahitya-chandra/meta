import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import prisma from '@repo/db';
import { sendFriendRequestSchema, friendRequestActionSchema } from '@repo/types';
import { TRPCError } from '@trpc/server';

export const friendsRouter = router({
  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
        select: { id: true, name: true, email: true },
      });
      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }
      return user;
    }),

  getFriendRequests: protectedProcedure
    .query(async ({ ctx }) => {
      const requests = await prisma.friendRequest.findMany({
        where: { addresseeId: ctx.userId, status: 'PENDING' },
        select: {
          id: true,
          requester: { select: { id: true, name: true, email: true } },
        },
      });
      return requests;
    }),

  sendFriendRequest: protectedProcedure
    .input(sendFriendRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const selfId = ctx.userId;
      const { friendId } = input;

      if (selfId === friendId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You cannot add yourself as a friend',
        });
      }

      const alreadyFriends = await prisma.friend.findFirst({
        where: {
          OR: [
            { userAId: selfId, userBId: friendId },
            { userAId: friendId, userBId: selfId },
          ],
        },
      });
      if (alreadyFriends) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are already friends',
        });
      }

      const existing = await prisma.friendRequest.findFirst({
        where: {
          OR: [
            { requesterId: selfId, addresseeId: friendId, status: 'PENDING' },
            { requesterId: friendId, addresseeId: selfId, status: 'PENDING' },
          ],
        },
      });
      if (existing) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Friend request already exists',
        });
      }

      const request = await prisma.friendRequest.create({
        data: { requesterId: selfId, addresseeId: friendId },
        include: { requester: { select: { id: true, name: true, email: true } } },
      });

    //   const recipientSocketId = userSockets.get(friendId);
    //   if (recipientSocketId) {
    //     io.to(recipientSocketId).emit('friendRequest', request);
    //   }

      return request;
    }),

  getFriends: protectedProcedure
    .query(async ({ ctx }) => {
      const friendships = await prisma.friend.findMany({
        where: { OR: [{ userAId: ctx.userId }, { userBId: ctx.userId }] },
        include: {
          userA: { select: { id: true, name: true, email: true } },
          userB: { select: { id: true, name: true, email: true } },
        },
      });
      return friendships.map(f => (f.userAId === ctx.userId ? f.userB : f.userA));
    }),

  acceptFriendRequest: protectedProcedure
    .input(friendRequestActionSchema)
    .mutation(async ({ ctx, input }) => {
      const { requestId } = input;
      const request = await prisma.friendRequest.findUnique({
        where: { id: requestId },
      });
      if (!request || request.addresseeId !== ctx.userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to accept this request',
        });
      }

      const updatedRequest = await prisma.friendRequest.update({
        where: { id: requestId },
        data: { status: 'ACCEPTED' },
      });

      const friendship = await prisma.friend.create({
        data: {
          userAId: updatedRequest.requesterId,
          userBId: updatedRequest.addresseeId,
        },
      });

      return friendship;
    }),

  rejectFriendRequest: protectedProcedure
    .input(friendRequestActionSchema)
    .mutation(async ({ ctx, input }) => {
      const { requestId } = input;
      const request = await prisma.friendRequest.findUnique({
        where: { id: requestId },
      });
      if (!request || request.addresseeId !== ctx.userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to reject this request',
        });
      }

      const updated = await prisma.friendRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' },
      });

      return updated;
    }),

  getMessages: protectedProcedure
    .input(
      sendFriendRequestSchema.extend({
        since: z.string().datetime().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { friendId, since } = input;
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: ctx.userId, receiverId: friendId },
            { senderId: friendId, receiverId: ctx.userId },
          ],
          ...(since ? { createdAt: { gte: new Date(since) } } : {}),
        },
        orderBy: { createdAt: 'asc' },
      });
      return messages;
    }),
});