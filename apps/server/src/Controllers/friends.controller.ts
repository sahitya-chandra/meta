import prisma from "@meta/db";
import { Request, Response } from "express";
import { z } from "zod";
import { userSockets } from "../utils/utils";
import { io } from "..";
import { AuthenticatedRequest } from "../types";

const sendFriendRequestSchema = z.object({
  selfId: z.string().optional(),
  friendId: z.string(),
});

const friendRequestActionSchema = z.object({
  requestId: z.string(),
});

export const getUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.query;
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFriendRequests = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const requests = await prisma.friendRequest.findMany({
      where: {
        addresseeId: userId,
        status: "PENDING",
      },
      select: {
        id: true,
        requester: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    res.json(requests);
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const sendFriendRequest = async (req: AuthenticatedRequest, res: Response) => {
  const selfId = req.userId;
  if (!selfId) return res.status(401).json({ error: "Unauthorized" });
  console.log("Body:", req.body);
  const parsed = sendFriendRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ msg : "Not valid due to type" });
  }

  const { friendId } = parsed.data;

  try {
    if (selfId === friendId) {
      return res
        .status(400)
        .json({ error: "You cannot add yourself as a friend" });
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
      return res.status(400).json({ error: "You are already friends" });
    }

    const existing = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { requesterId: selfId, addresseeId: friendId, status: "PENDING" },
          { requesterId: friendId, addresseeId: selfId, status: "PENDING" },
        ],
      },
    });

    if (existing) {
      return res
        .status(400)
        .json({ error: "Friend request already exists" });
    }

    const request = await prisma.friendRequest.create({
      data: {
        requesterId: selfId,
        addresseeId: friendId,
      },
      include: {
        requester: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    const recipientSocketId = userSockets.get(friendId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("friendRequest", request);
    }

    res.json(request);
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFriends = async (req: AuthenticatedRequest, res: Response) => {
  const userId  = req.userId;
  console.log("Fetching friends for user:", userId);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const friendships = await prisma.friend.findMany({
      where: {
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      include: {
        userA: { select: { id: true, name: true, email: true } },
        userB: { select: { id: true, name: true, email: true } },
      },
    });
    console.log("Friendships fetched:", friendships);
    const friends = friendships.map((f) =>
      f.userAId === userId ? f.userB : f.userA
    );
    console.log("Friends fetched:", friends);

    res.json(friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ error: "Failed to fetch friends" });
  }
};

export const acceptFriendRequest = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  console.log("Body:", req.body);
  const parsed = friendRequestActionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error });
  }
  console.log("Accepting friend request:", parsed.data);
  const { requestId } = parsed.data;

  try {
    const request = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });
    if (!request || request.addresseeId !== userId) {
      return res.status(403).json({ error: "Not authorized to accept this request" });
    }

    const updatedRequest = await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: "ACCEPTED" },
    });

    const friendship = await prisma.friend.create({
      data: {
        userAId: updatedRequest.requesterId,
        userBId: updatedRequest.addresseeId,
      },
    });

    res.status(200).json(friendship);
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const rejectFriendRequest = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const parsed = friendRequestActionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error });
  }

  const { requestId } = parsed.data;

  try {
    const request = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });
    if (!request || request.addresseeId !== userId) {
      return res.status(403).json({ error: "Not authorized to accept this request" });
    }
    
    const updated = await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED" },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const parsed = sendFriendRequestSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error });
  }

  const { friendId } = parsed.data;
  const since = req.query.since ? new Date(req.query.since as string) : undefined;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
        ...(since ? { createdAt: { gte: since } } : {}),
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    console.log("Messages fetched:", messages);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
