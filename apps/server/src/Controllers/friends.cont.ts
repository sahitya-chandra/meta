import prisma from "@meta/db";

export const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const resp = await prisma.user.findUnique({ where: { email } });
    res.json(resp);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFriendRequests = async (req, res) => {
  const { userId } = req.params;
  try {
    const requests = await prisma.friendship.findMany({
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

export const sendFriendRequest = async (req, res) => {
  const { selfId, friendId } = req.body;
  try {
    const resp = await prisma.friendship.create({
      data: {
        addresseeId: friendId,
        requesterId: selfId,
      },
    });
    res.json(resp);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFriends = async (req, res) => {
  const { userId } = req.params;
  console.log("Fetching friends for user:", userId);
  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      include: {
        requester: true,
        addressee: true,
      },
    });

    const friends = friendships.map((f) =>
      f.requesterId === userId ? f.addressee : f.requester
    );

    res.json(friends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch friends" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  const { friendshipId } = req.body;
  try {
    const updated = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: "ACCEPTED" },
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const rejectFriendRequest = async (req, res) => {
  const { friendshipId } = req.body;
  try {
    const updated = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: "REJECTED" },
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
