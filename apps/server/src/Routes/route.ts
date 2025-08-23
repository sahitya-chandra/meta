import express from "express";
import {
  getUserByEmail,
  getFriendRequests,
  sendFriendRequest,
  getFriends,
  acceptFriendRequest,
  rejectFriendRequest,
  getMessages,
} from "../Controllers/friends.controller";
import { httpAuthMiddleware } from "../middleware/httpAuth.middleware";

const router = express.Router();

router.get("/users", getUserByEmail);
router.get("/friends", httpAuthMiddleware, getFriends);
router.get("/messages", httpAuthMiddleware, getMessages)
router.get("/friend-requests/:userId", httpAuthMiddleware, getFriendRequests);
router.post("/friend-requests", httpAuthMiddleware, sendFriendRequest);
router.post("/accept-friend-request", httpAuthMiddleware, acceptFriendRequest);
router.post("/reject-friend-request", httpAuthMiddleware, rejectFriendRequest);

export default router;
