import prisma from "@meta/db";
import { Request, Response } from "express";
import { z } from "zod";

const sendFriendRequestSchema = z.object({
  selfId: z.string().uuid(),
  friendId: z.string().uuid(),
});

const friendRequestActionSchema = z.object({
  requestId: z.string().uuid(),
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

export const getFriendRequests = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const requests = await prisma.friendRequest.findMany({
      where: {
        addresseeId: userId,
        status: "PENDING",
      },
      include: {
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

export const sendFriendRequest = async (req: Request, res: Response) => {
  const parsed = sendFriendRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const { selfId, friendId } = parsed.data;

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
    });

    res.json(request);
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFriends = async (req: Request, res: Response) => {
  const { userId } = req.params;

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

    const friends = friendships.map((f) =>
      f.userAId === userId ? f.userB : f.userA
    );

    res.json(friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ error: "Failed to fetch friends" });
  }
};

export const acceptFriendRequest = async (req: Request, res: Response) => {
  const parsed = friendRequestActionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const { requestId } = parsed.data;

  try {
    const request = await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: "ACCEPTED" },
    });

    const friendship = await prisma.friend.create({
      data: {
        userAId: request.requesterId,
        userBId: request.addresseeId,
      },
    });

    res.status(200).json(friendship);
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const rejectFriendRequest = async (req: Request, res: Response) => {
  const parsed = friendRequestActionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const { requestId } = parsed.data;

  try {
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
