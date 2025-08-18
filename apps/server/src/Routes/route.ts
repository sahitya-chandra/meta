import express from "express";
import {
  getUserByEmail,
  getFriendRequests,
  sendFriendRequest,
  getFriends,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../Controllers/friends.cont";

const router = express.Router();

router.get("/addfriend/:email", getUserByEmail);
router.get("/friend-requests/:userId", getFriendRequests);
router.post("/friendreq", sendFriendRequest);
router.get("/friends/:userId", getFriends);
router.post("/accept-friend-request", acceptFriendRequest);
router.post("/reject-friend-request", rejectFriendRequest);

export default router;
