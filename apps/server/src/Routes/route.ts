import express from "express";
import {
  getUserByEmail,
  getFriendRequests,
  sendFriendRequest,
  getFriends,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../Controllers/friends.controller";

const router = express.Router();

router.get("/users", getUserByEmail);
router.get("/friends/:userId", getFriends);
router.get("/friend-requests/:userId", getFriendRequests);
router.post("/friend-requests", sendFriendRequest);
router.post("/accept-friend-request", acceptFriendRequest);
router.post("/reject-friend-request", rejectFriendRequest);

export default router;
