import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { throttle } from "lodash";
import { Message } from "@/lib/types";

let socket: Socket | null = null;

export function useChat(userId: string, token: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!token || !userId) return;

    if (!socket || socket.disconnected) {
      socket = io("ws://localhost:4000", {
        query: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.on("connect", () => {
        console.log("Connected with socket:", socket?.id);
      });

      socket.on("newMessage", (msg: Message) => {
        console.log("Received newMessage:", msg);
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) {
            console.log("Duplicate message ignored:", msg.id);
            return prev;
          }
          return [...prev, msg];
        });
      });

      socket.on("messageSent", (msg: Message) => {
        console.log("Received messageSent:", msg);
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) {
            console.log("Duplicate messageSent ignored:", msg.id);
            return prev;
          }
          return [...prev, msg];
        });
      });

      socket.on("userTyping", (fromUserId: string) => {
        console.log("Typing from:", fromUserId);
        setTypingUser(fromUserId);
        setTimeout(() => setTypingUser(null), 2000);
      });

      socket.on("onlineUsers", (users: string[]) => {
        console.log("Received onlineUsers:", users);
        setOnlineUsers(users);
      });

      socket.on("error", (err: string) => {
        console.error("Socket error:", err);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected");
      });
    }

    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("newMessage");
        socket.off("messageSent");
        socket.off("userTyping");
        socket.off("onlineUsers");
        socket.off("error");
        socket.disconnect();
        socket = null;
      }
    };
  }, [token, userId]);

  const sendMessage = (toUserId: string, content: string) => {
    if (socket && content.trim()) {
      console.log("Sending message to:", toUserId, content);
      socket.emit("sendMessage", { toUserId, content });
    }
  };

  const sendTyping = throttle((toUserId: string) => {
    if (socket) {
        console.log("Sending typing to:", toUserId);
        socket.emit("typing", toUserId);
    }
  }, 1000);

  return { messages, friendRequests, typingUser, sendMessage, sendTyping, onlineUsers };
}